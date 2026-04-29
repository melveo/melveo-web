# Well-known files

## `apple-app-site-association` — Universal Links

iOS verifies this file when an app declares an Associated Domain.
Cloudflare Pages serves files in `/.well-known/` with the correct
`Content-Type: application/json` automatically (no `_headers` rule
needed for path-only matches).

### Setup checklist

1. **Replace `TEAMID`** in `apple-app-site-association` with the real
   Apple Developer Team ID once we have a paid Apple Developer Program
   membership.
2. The bundle ID `app.melveo.melveo` mirrors `Melveo/Melveo/Info.plist`
   `CFBundleIdentifier`. Verify before the first TestFlight build.
3. Add the entitlement in Xcode (project.yml) under associated domains:
   ```
   applinks:melveo.app
   webcredentials:melveo.app
   ```
4. Test the file is reachable:
   ```
   curl -I https://melveo.app/.well-known/apple-app-site-association
   # Must return 200 + content-type: application/json (no .json extension)
   ```
5. Apple's CDN aggressively caches AASA — after deploys, force a refresh:
   ```
   xcrun simctl appinfo booted app.melveo.melveo  # for sim debug
   ```

## See also

- Apple docs: https://developer.apple.com/documentation/xcode/supporting-associated-domains
- Doc 177 fáze Q (Universal Links + AASA) in the team_app planning stack
