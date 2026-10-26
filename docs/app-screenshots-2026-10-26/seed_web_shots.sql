\set ON_ERROR_STOP on
-- Marketing screenshots for melveo.app — LOCAL melveo_shots stack only.
-- Builds on scripts/seed_demo_club.sh + qa seeds. Idempotent per day.
begin;

do $$
begin
    if current_database() <> 'postgres'
       or not exists (select 1 from auth.users where email = 'demo_coach@melveo.test') then
        raise exception 'Demo fixture missing — run seed_demo_club.sh first';
    end if;
end $$;

-- 1. Test personas out of the player roster (they read as "Alex Demo (Matice rolí)").
delete from public.team_memberships m
 using auth.users u
 where u.id = m.person_id
   and m.team_season_id = '00000000-0000-0000-0000-000000000003'
   and m.role = 'player'
   and u.email in ('demo_matrix@melveo.test', 'demo_multi@melveo.test', 'demo_pc@melveo.test');

create temp table shots_players as
select u.id as person_id, row_number() over (order by u.email)::int as n
  from auth.users u
 where u.email ~ '^demo_p0[1-8]@melveo\.test$';

-- 2. Every player shares wellness, load and cardio with the coach.
insert into public.wellness_sharing_grants (
    person_id, club_id, team_season_id, status, share_from_day,
    share_baseline_days, share_activity_load, share_cardio_metrics,
    share_individual_activities, share_cardio_from_day, revoked_at
)
select person_id, '00000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000003', 'active',
       current_date - 28, 14, true, true, true, current_date - 28, null
  from shots_players
on conflict (person_id, team_season_id) do update set
    status = 'active', share_from_day = excluded.share_from_day,
    share_baseline_days = excluded.share_baseline_days,
    share_activity_load = true, share_cardio_metrics = true,
    share_individual_activities = true,
    share_cardio_from_day = excluded.share_cardio_from_day,
    revoked_at = null, updated_at = now();

update public.readiness_configuration set enabled = true;

-- 3. Today's check-ins through the app RPC (readiness gets computed).
--    p05 tired with knee pain, p03 a bit low, p08 has not checked in yet.
delete from public.daily_wellness_checkins d
 using shots_players p
 where d.person_id = p.person_id
   and d.submitted_day = (now() at time zone 'Europe/Prague')::date;
delete from public.morning_checkins m
 using shots_players p
 where m.person_id = p.person_id
   and m.submitted_day = (now() at time zone 'Europe/Prague')::date;

do $$
declare
    r record;
    v_day date := (now() at time zone 'Europe/Prague')::date;
    v_energy int; v_sleep int; v_mood int; v_motivation int;
    v_pain text; v_regions jsonb;
begin
    for r in select * from shots_players where n <> 8 order by n loop
        perform set_config('request.jwt.claims', json_build_object('sub', r.person_id::text, 'role', 'authenticated')::text, true);
        perform set_config('request.jwt.claim.sub', r.person_id::text, true);
        v_energy := 4 + (r.n % 2); v_sleep := 4; v_mood := 4 + ((r.n + 1) % 2); v_motivation := 4 + (r.n % 2);
        v_pain := 'none'; v_regions := '[]'::jsonb;
        if r.n = 3 then v_energy := 3; v_sleep := 3; v_mood := 3; end if;
        if r.n = 5 then
            v_energy := 2; v_sleep := 2; v_mood := 3; v_motivation := 3;
            v_pain := 'present';
            v_regions := jsonb_build_array(jsonb_build_object(
                'region_key', 'knee', 'muscle_key', 'knees', 'side', 'right',
                'severity', 2, 'perspective', 'front',
                'limits_activity', 'yes', 'pain_pattern', 'new_or_worse'));
        end if;
        perform public.submit_my_daily_wellness_v3(gen_random_uuid(), null,
            jsonb_build_object('day', v_day, 'energy', v_energy,
                'sleep_quality', v_sleep, 'mood', v_mood,
                'motivation', v_motivation, 'pain_status', v_pain,
                'pain_regions', v_regions),
            '00000000-0000-0000-0000-000000000003');
    end loop;
end $$;

-- 4. Morning HRV (rMSSD) for 21 days, p05 dipping the last three days.
do $$
declare
    r record; d int;
    v_day date := (now() at time zone 'Europe/Prague')::date;
    v_base int; v_val numeric;
begin
    for r in select * from shots_players order by n loop
        perform set_config('request.jwt.claims', json_build_object('sub', r.person_id::text, 'role', 'authenticated')::text, true);
        perform set_config('request.jwt.claim.sub', r.person_id::text, true);
        perform set_config('role', 'authenticated', true);
        v_base := 46 + r.n * 4;
        for d in 0..20 loop
            continue when r.n = 8 and d = 0;
            v_val := v_base + ((d * 7 + r.n * 3) % 11) - 5;
            if r.n = 5 and d <= 2 then v_val := v_val - (14 - d * 4); end if;
            perform public.submit_my_hrv_measurement_v3(
                p_metric_kind => 'rmssd',
                p_value_ms => v_val,
                p_measured_at => least(((v_day - d) + time '07:05') at time zone 'Europe/Prague', now()),
                p_source_family => 'polar_rr',
                p_source_detail => '{"fixture":"web-shots"}'::jsonb,
                p_source_device_id => 'fixture-h10',
                p_posture => 'supine',
                p_stabilization_seconds => 60,
                p_recording_seconds => 60,
                p_rr_count => 60,
                p_artifact_count => 0,
                p_quality_state => 'valid',
                p_protocol_version => 'polar_morning_supine_v1',
                p_quality_algorithm_version => 'rr_artifact_v1',
                p_idempotency_key => 'web-shots-' || r.n || '-' || (v_day - d),
                p_resting_hr => (50 + r.n)::integer);
        end loop;
        perform set_config('role', 'postgres', true);
    end loop;
end $$;

-- 5. Three weeks of completed trainings with attendance, RPE and load.
do $$
declare
    v_coach uuid := (select id from auth.users where email = 'demo_coach@melveo.test');
    v_team uuid := '00000000-0000-0000-0000-000000000003';
    v_ids uuid[] := array(select person_id from shots_players order by n);
    v_titles text[] := array['Kondice', 'Rychlost a obrátky', 'Taktika obrany', 'Kondice', 'Herní situace', 'Rychlost a obrátky', 'Rozbor soupeře a herní situace'];
    v_days int[] := array[20, 17, 13, 10, 6, 3, 0];
    v_session uuid; i int; p int; v_status text; v_rpe int;
begin
    for i in 1..7 loop
        v_session := ('00000000-0000-0000-0000-0000000005' || lpad(i::text, 2, '0'))::uuid;
        perform set_config('request.jwt.claims', json_build_object('sub', v_coach::text, 'role', 'authenticated')::text, true);
        perform set_config('request.jwt.claim.sub', v_coach::text, true);
        insert into public.training_sessions (id, team_season_id, kind, title, starts_at, ends_at, location, created_by)
        values (v_session, v_team, 'training', v_titles[i],
                date_trunc('day', now()) - (v_days[i] || ' days')::interval + interval '16 hours',
                date_trunc('day', now()) - (v_days[i] || ' days')::interval + interval '17 hours 30 minutes',
                'Hala Strahov', v_coach)
        on conflict (id) do update set title = excluded.title, starts_at = excluded.starts_at,
            ends_at = excluded.ends_at, canceled_at = null;
        perform public.set_session_participants_v1(v_session, v_ids);
        for p in 1..array_length(v_ids, 1) loop
            v_status := case when (p + i) % 9 = 0 then 'absent' when (p + i) % 7 = 0 then 'late' else 'present' end;
            perform public.mark_attendance_v1(v_session, v_ids[p], v_status, null);
        end loop;
        for p in 1..array_length(v_ids, 1) loop
            continue when (p + i) % 9 = 0;
            v_rpe := 5 + ((p + i * 2) % 4);
            perform set_config('request.jwt.claims', json_build_object('sub', v_ids[p]::text, 'role', 'authenticated')::text, true);
            perform set_config('request.jwt.claim.sub', v_ids[p]::text, true);
            perform public.submit_rpe_v1(v_session, v_rpe::smallint, null);
        end loop;
        insert into public.session_expected_load (session_id, expected_load_au, confidence, reason_codes, computed_at)
        values (v_session, 540, 0.75, array['web_shots_fixture'], now())
        on conflict (session_id) do update set expected_load_au = excluded.expected_load_au;
        insert into public.session_actual_load (session_id, actual_load_au, source, confidence, submitted_by, submitted_at)
        values (v_session, 500 + i * 23, 'manual_plus_rpe', 0.8, v_coach, now())
        on conflict (session_id) do update set actual_load_au = excluded.actual_load_au;
    end loop;
end $$;

commit;

select (select count(*) from public.wellness_sharing_grants where team_season_id = '00000000-0000-0000-0000-000000000003') as grants,
       (select count(*) from public.daily_wellness_checkins where submitted_day = (now() at time zone 'Europe/Prague')::date) as today_checkins,
       (select count(*) from public.personal_hrv_measurements where idempotency_key like 'web-shots-%') as hrv,
       (select count(*) from public.training_sessions where id::text like '00000000-0000-0000-0000-0000000005%') as trainings;
