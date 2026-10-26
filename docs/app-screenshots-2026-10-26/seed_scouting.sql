\set ON_ERROR_STOP on
begin;
do $$
declare v_coach uuid := (select id from auth.users where email='demo_coach@melveo.test'); r jsonb;
begin
  perform set_config('request.jwt.claims', json_build_object('sub', v_coach::text, 'role', 'authenticated')::text, true);
  perform set_config('request.jwt.claim.sub', v_coach::text, true);
  r := public.me_match_create_scouting_setup_v1(
    '00000000-0000-0000-0000-00000000c0a1'::uuid, '00000000-0000-0000-0000-000000000003'::uuid,
    'HC Tigers', date_trunc('day', now()) - interval '6 days' + interval '18 hours',
    '[{"jersey_number":2,"display_name":"Rak"},{"jersey_number":5,"display_name":"Holub"},{"jersey_number":8,"display_name":"Kolář"},
      {"jersey_number":10,"display_name":"Šimek"},{"jersey_number":12,"display_name":"Bureš"},{"jersey_number":18,"display_name":"Vávra"},
      {"jersey_number":22,"display_name":"Lukeš"},{"jersey_number":24,"display_name":"Pokorný"},{"jersey_number":1,"display_name":"Hájek"}]'::jsonb,
    'HC Sever', null, 24, 22);
  raise notice 'scouting: %', r;
end $$;
commit;
