# Google OAuth setup

The code integration is complete. The remaining values must be created in the Google account that will own the OAuth consent screen.

1. In Google Cloud, configure the OAuth consent screen with the real support email, operator identity, privacy URL, and terms URL.
2. Create an **OAuth client ID → Web application**.
3. Add `http://localhost:3000` and the final Vercel origin as authorized JavaScript origins.
4. Run `npx convex env get CONVEX_SITE_URL`, append `/api/auth/callback/google`, and add that redirect URI. Repeat with `--prod`; development and production have different URLs.
5. Set credentials in Convex, never in Git:

   ```bash
   npx convex env set AUTH_GOOGLE_ID 'your-client-id'
   npx convex env set AUTH_GOOGLE_SECRET 'your-client-secret'
   npx convex env set --prod AUTH_GOOGLE_ID 'your-client-id'
   npx convex env set --prod AUTH_GOOGLE_SECRET 'your-client-secret'
   ```

6. After Vercel assigns the domain, run:

   ```bash
   npx @convex-dev/auth --prod --allow-dirty-git-state --web-server-url https://YOUR_DOMAIN
   npx convex deploy
   ```

7. Redeploy Vercel and test sign-in in an incognito window. If the domain changes, update the Google origin and Convex `SITE_URL` together.
