\set ON_ERROR_STOP on
begin;
do $$
declare
  v_coach uuid := (select id from auth.users where email='demo_coach@melveo.test');
  v_sid uuid := (select id from public.training_sessions where kind='scouting' and match_data->>'scouted_team'='HC Tigers' order by created_at desc limit 1);
  pl uuid[]; gk uuid; i int; t int; ph text; sec int; who uuid; sit text; payload jsonb;
  -- situation ids
  s_g text := 'ad51c686-acec-4ced-bcef-ac52d2d4bd67'; s_mg text := 'ab7519de-e80f-4e5f-befb-565617c8ee01';
  s_mo text := '2b922d14-9995-4d22-8902-79aa3372c480'; s_t text := 'ba066454-337f-4d9c-89c8-a35ae9f37a75';
  s_a text := 'df4b57cd-214f-472b-b8f1-ab3f9260ef2a'; s_wb text := '8279cb03-d052-45c1-a410-0985bdaea358';
  s_7 text := '03d41906-8d23-4a96-a90b-e47afd21f9a5'; s_2m text := '2396e86d-5004-4a1f-8c70-da4c63a7a0d1';
  s_ga text := 'eefc7a93-3978-4dc2-abd1-366e3537869d'; s_sv text := '903695b8-7fd5-4fc9-ab68-1b22419751ac';
  -- 60 events over 2 x 30 min; pattern: G every ~2.5 min, shooters weighted to 10, 22, 8
  shooters int[] := array[10,22,8,10,18,22,5,10,24,8,22,10,12,18,10,22,8,5,10,22,24,10,18,22];
  zones int[] := array[5,8,3,6,11,9,2,5,13,7,9,4,6,10,5,8,3,12,6,9,14,5,11,8];
  gzones int[] := array[3,1,7,9,2,3,6,1,9,7,4,3,8,1,9,3,7,2,1,6,9,3,7,1];
begin
  perform set_config('request.jwt.claims', json_build_object('sub', v_coach::text, 'role', 'authenticated')::text, true);
  perform set_config('request.jwt.claim.sub', v_coach::text, true);
  select array_agg(op.id order by op.jersey_number) into pl from public.opponent_players op
    join public.training_sessions s on s.opponent_team_id=op.opponent_team_id where s.id=v_sid;
  select op.id into gk from public.opponent_players op join public.training_sessions s on s.opponent_team_id=op.opponent_team_id where s.id=v_sid and op.jersey_number=1;
  if exists (select 1 from public.match_events where session_id=v_sid) then return; end if;
  for i in 1..24 loop
    t := (i - 1) * 145 + 40 + (i * 17) % 60;           -- 0..3600 s
    ph := case when t < 1800 then 'first_half' else 'second_half' end;
    sec := case when t < 1800 then t else t - 1800 end;
    select op.id into who from public.opponent_players op join public.training_sessions s on s.opponent_team_id=op.opponent_team_id where s.id=v_sid and op.jersey_number=shooters[i];
    perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
      'situation_id', s_g, 'opponent_player_id', who, 'court_zone', zones[i], 'goal_zone', gzones[i],
      'clock_quality','confirmed','clock_phase',ph,'clock_seconds',sec));
    if i % 3 = 0 then
      perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
        'situation_id', s_a, 'opponent_player_id', pl[1 + (i % array_length(pl,1))],
        'clock_quality','confirmed','clock_phase',ph,'clock_seconds',sec));
    end if;
    if i % 2 = 0 then
      perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
        'situation_id', s_mg, 'opponent_player_id', pl[1 + ((i*3) % array_length(pl,1))], 'court_zone', 1 + (i*5) % 16, 'goal_zone', 1 + (i*7) % 9,
        'clock_quality','confirmed','clock_phase',ph,'clock_seconds',least(sec + 50, 1795)));
    end if;
    if i % 5 = 0 then
      perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
        'situation_id', s_mo, 'opponent_player_id', pl[1 + ((i*2) % array_length(pl,1))], 'court_zone', 1 + (i*3) % 16,
        'goal_frame_part', (array['post_left','crossbar','wide','post_right'])[1 + i % 4],
        'clock_quality','confirmed','clock_phase',ph,'clock_seconds',least(sec + 70, 1795)));
      perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
        'situation_id', s_t, 'opponent_player_id', pl[1 + ((i*4) % array_length(pl,1))],
        'clock_quality','confirmed','clock_phase',ph,'clock_seconds',least(sec + 90, 1795)));
    end if;
    if i % 4 = 1 then
      perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
        'situation_id', s_wb, 'opponent_player_id', pl[1 + ((i*5) % array_length(pl,1))],
        'clock_quality','confirmed','clock_phase',ph,'clock_seconds',least(sec + 20, 1795)));
    end if;
  end loop;
  -- goalkeeper: 22 conceded + 11 saves
  for i in 1..22 loop
    t := (i - 1) * 160 + 70;
    ph := case when t < 1800 then 'first_half' else 'second_half' end;
    perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
      'situation_id', s_ga, 'opponent_player_id', gk, 'position_role','GK', 'court_zone', 1 + (i*7) % 16, 'goal_zone', 1 + (i*4) % 9,
      'clock_quality','confirmed','clock_phase',ph,'clock_seconds',case when t < 1800 then t else t - 1800 end));
    if i % 2 = 0 then
      perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
        'situation_id', s_sv, 'opponent_player_id', gk, 'position_role','GK', 'court_zone', 1 + (i*3) % 16, 'goal_zone', 1 + (i*2) % 9,
        'clock_quality','confirmed','clock_phase',ph,'clock_seconds',least(case when t < 1800 then t else t - 1800 end + 40, 1795)));
    end if;
  end loop;
  perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
    'situation_id', s_7, 'opponent_player_id', pl[4], 'clock_quality','confirmed','clock_phase','first_half','clock_seconds',1210));
  perform public.me_match_post_match_event_upsert_v1(gen_random_uuid(), v_sid, jsonb_build_object(
    'situation_id', s_2m, 'opponent_player_id', pl[6], 'clock_quality','confirmed','clock_phase','second_half','clock_seconds',910));
end $$;
commit;
select count(*) events from public.match_events where session_id=(select id from public.training_sessions where kind='scouting' and match_data->>'scouted_team'='HC Tigers' order by created_at desc limit 1);
