# Environment Variables

The application requires the following environment variables to be set in `.env.local` for local development and in the Vercel Dashboard for production.

## Required Variables

| Variable Name | Description | Value (Example) |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | The URL of your Supabase project. | `https://your-project-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The anonymous public key for your Supabase project. | `eyJhbGciOiJIUzI1NiIsInR...` |

## How to Get These Keys

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Go to **Settings** -> **API**.
4.  Copy the **Project URL** and **anon public** key.

## Production (Vercel)

When deploying to Vercel, ensure you add these variables in the **Settings** -> **Environment Variables** section of your Vercel project.
