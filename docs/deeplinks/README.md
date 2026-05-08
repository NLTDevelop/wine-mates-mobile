# WineMates App Links / Universal Links

Upload these files to the backend domain without redirects and with `application/json` content type:

- `https://wine-mates.nltdev.pp.ua/.well-known/assetlinks.json`
- `https://wine-mates.nltdev.pp.ua/.well-known/apple-app-site-association`

Deep link format used by the app:

```text
https://wine-mates.nltdev.pp.ua/event/<eventId>
```

Android package: `com.winemates`.
iOS app ID: `4233RP9762.com.nltdev.winemates.dev`.

If Google Play App Signing is enabled, add the Play Console App signing certificate SHA-256 fingerprint to `assetlinks.json` too. The current file includes the local release/upload fingerprint and debug fingerprint for development testing.
