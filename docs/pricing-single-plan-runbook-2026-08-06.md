# Runbook: přechod na jeden placený tarif (4 990 Kč)

Rozhodnutí majitele 2026-08-06: Core / Live / Intelligence se slučují do
**jednoho placeného tarifu za 4 990 Kč měsíčně / 49 900 Kč ročně**. Zdarma
zůstává Free Starter, nad tím je individuální plán na míru („napiš nám“).

**Web je hotový a nasazený** — `src/components/PricingStage.astro`, jediný placený
tarif `id: 'team'`, název **Melveo Team**. Zbývají dvě místa, do kterých z tohohle
stroje nedosáhnu: **Supabase `plan_prices`** a **Stripe**.

---

## Dobrá zpráva: ceny se nemění

Ověřeno proti lokálnímu stacku `melveo_ci_marketing` (schéma i data odpovídají
současné appce). Tarif `team_intelligence` **už dnes nese přesně tu cenu**, na
kterou přecházíme, a má k ní vytvořené Stripe Price objekty:

| plán | interval | `amount_minor` | = Kč | Stripe price id |
|---|---|---|---|---|
| `team_intelligence` | month | `499000` | 4 990 | `price_1TirVaQ4sGeL8RNtikFoXuyO` |
| `team_intelligence` | year | `4990000` | 49 900 | `price_1TirVbQ4sGeL8RNt8FulOnbm` |

**Žádnou novou cenu tedy vytvářet nemusíš.** Migrace je hlavně o tom vypnout, co
se přestává nabízet. To je řádově menší a bezpečnější zásah než přecenění.

> Pozor na jednotky: `plan_prices.amount_minor` je v **haléřích**. 4 990 Kč =
> `499000`, ne `4990`. Chyba o dva řády je tu ta nejsnáz udělatelná.

> Tahle čísla jsou ověřená na **lokálním** stacku. Než cokoli spustíš na produkci,
> potvrď, že tam sedí stejně.

---

## Krok 1 — zkontroluj, jestli někdo na rušených tarifech neběží

**Tohle udělej první, ať víš, jestli vůbec něco migruješ.**

```sql
select p.code, s.status, count(*)
from public.subscriptions s
join public.plans p on p.id = s.plan_id
where p.code in ('team_core','team_live')
group by 1, 2;
```

- **Nula řádků** → nikoho nemigruješ, pokračuj krokem 2. To je pravděpodobný stav,
  protože jste před prvním velkým klientem, a je to důvod, proč se tahle změna
  dělá teď a ne za rok.
- **Něco tam je** → zastav se a rozhodni, jestli je převést na nový tarif, nebo
  nechat doběhnout na starém. Stripe umí obojí, ale je to rozhodnutí o penězích
  konkrétních lidí, ne technikálie.

## Krok 2 — Supabase

> Sloupce tabulky `plans` jsou **`code`, `display_name`, `tier`, `is_public`** —
> ne `slug` / `name` / `sort_order` / `is_active`. Ověřeno proti schématu.

Přejmenovat zbývající placený tarif a schovat dva rušené. **Nemazat** — historické
předplatné a faktury se na ně odkazují.

```sql
-- jediný placený tarif dostane neutrální jméno
update public.plans
   set code = 'team',
       display_name = 'Melveo Team',
       tier = 1
 where code = 'team_intelligence';

-- rušené tarify přestanou být veřejně nabízené
update public.plans set is_public = false
 where code in ('team_core','team_live');

-- popis Athlete Packu odkazuje na zrušené tarify
update public.plans
   set description = 'Add-on: +10 hráčů per team_season. Účtováno samostatně k tarifu Melveo Team.'
 where code = 'team_athlete_pack';
```

Ověření:

```sql
select code, display_name, tier, is_public from public.plans order by tier;
```

Očekávaný výsledek: `is_public = true` má jen `team_starter` a `team`.
`team_athlete_pack` je `false` už dnes (je to add-on, ne samostatný tarif).

## Krok 3 — Stripe

Ceny **nevytvářej ani neupravuj** — Price objekty jsou v Stripu neměnné a ty
správné už existují. Práce je jen tato:

1. **Archivuj Price objekty** Core a Live, ať je nikdo nemůže koupit. V dashboardu
   Product → Price → Archive. Archivace **neruší běžící předplatné**, jen zabrání
   novým nákupům.
2. **Přejmenuj Product** `Team Intelligence` na `Melveo Team`. Product jméno se
   měnit dá a promítne se do faktur.
3. **Zkontroluj Payment Links a checkout konfigurace**, jestli některý nemíří na
   archivovanou cenu. Takový odkaz přestane fungovat.

Co **nedělat**: nemazat Price objekty a nesahat na `price_1TirVa…` a
`price_1TirVb…` — to jsou ty, které zůstávají v provozu.

## Krok 4 — zpětná kontrola

```sql
select p.code, pp.interval, pp.amount_minor, pp.stripe_price_id, pp.archived_at
from public.plan_prices pp
join public.plans p on p.id = pp.plan_id
where p.is_public
order by p.tier, pp.interval;
```

Sedět má: Free Starter na nule, `team` na `499000` / `4990000`, Athlete Pack na
`590000` ročně. A `stripe_price_id` u aktivních řádků musí odpovídat Price
objektům, které jsi v Stripu **nearchivoval**.

---

## Proč to takhle

`AGENTS.md` říká, že ceny žijí na třech místech a web je kanonický. Web je
srovnaný jako první právě proto. Zbylá dvě místa mají tenhle runbook, aby se
nedělala z hlavy — a hlavně aby se nesahalo na Stripe víc, než je nutné.
