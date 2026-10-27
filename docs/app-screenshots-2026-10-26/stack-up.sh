#!/usr/bin/env bash
set -euo pipefail
REPO=/Users/matty/Developer/melveo-app-marketing
WORK=$HOME/Library/Caches/MelveoShots/supabase
ln -sfn "$REPO/supabase/functions" "$WORK/supabase/functions"
supabase start --workdir "$WORK" --ignore-health-check --exclude "studio,imgproxy,postgres-meta,logflare,vector,supavisor"
export MELVEO_SUPABASE_CONFIG="$WORK/supabase/config.toml" MELVEO_SUPABASE_STATUS_WORKDIR="$WORK"
export SUPABASE_PROJECT_ID=melveo_shots SUPABASE_DB_CONTAINER=supabase_db_melveo_shots
export SUPABASE_API_PORT=47621 SUPABASE_DB_PORT=47622 SUPABASE_LOCAL_API_URL=http://127.0.0.1:47621
export SUPABASE_PSQL_MODE=host SUPABASE_DB_CONNECT_TIMEOUT_SECONDS=45
export MELVEO_SUPABASE_LOCK_ROOT=$HOME/Library/Caches/MelveoShots/locks
mkdir -p "$MELVEO_SUPABASE_LOCK_ROOT"
for i in $(seq 1 30); do curl -fsS -m 5 http://127.0.0.1:47621/auth/v1/health >/dev/null && break; sleep 3; done
bash "$REPO/scripts/supabase_apply_init.sh"
ANON=$(supabase status --workdir "$WORK" -o env 2>/dev/null | awk -F= '$1=="ANON_KEY"||$1=="SUPABASE_ANON_KEY"{gsub(/^"|"$/,"",$2);print $2;exit}')
umask 077
{
  for v in MELVEO_SUPABASE_CONFIG MELVEO_SUPABASE_STATUS_WORKDIR SUPABASE_PROJECT_ID SUPABASE_DB_CONTAINER SUPABASE_API_PORT SUPABASE_DB_PORT SUPABASE_LOCAL_API_URL SUPABASE_PSQL_MODE SUPABASE_DB_CONNECT_TIMEOUT_SECONDS MELVEO_SUPABASE_LOCK_ROOT; do printf 'export %s=%q\n' "$v" "${!v}"; done
  printf 'export MELVEO_SUPABASE_URL=%q\n' "$SUPABASE_LOCAL_API_URL"
  printf 'export MELVEO_SUPABASE_ANON_KEY=%q\n' "$ANON"
} > ${SHOTS_ENV:-./shots.env}
echo LANE_READY
