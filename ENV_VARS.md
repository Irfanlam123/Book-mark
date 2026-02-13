# Environment Variables

The application requires the following environment variables to be set in `.env.local` for local development and in the Vercel Dashboard for production.

## Required Variables

| Variable Name | Description | Value (Example) |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon (Public) Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Optional / Advanced

| Variable Name | Description | Value (Example) |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | **CRITICAL FOR MOBILE/PROD**: The absolute URL of your site. If not set, defaults to `http://localhost:3000`. | `https://my-app.vercel.app` |

---

## 📱 Troubleshooting Mobile Login

If login works on PC but fails on mobile/cross-device:

1.  **Set `NEXT_PUBLIC_SITE_URL`**: Ensure this is set to your production URL (e.g., `https://smart-bookmark-app.vercel.app`) in your Vercel Project Settings.
2.  **Redirect URLs**: Add `https://smart-bookmark-app.vercel.app/**` to your **Supabase Auth -> Redirect URLs** and **Google Cloud Console**.
3.  **Local Testing**: You cannot test Google Login on mobile via a local IP (e.g., `192.168.x.x`) because Google blocks private IP redirects. Use a tunnel like `ngrok` or deploy to Vercel to test on mobile.
