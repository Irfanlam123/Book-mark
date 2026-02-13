# Smart Bookmark App 🚀

A production-ready, full-stack Next.js application for managing personal bookmarks with realtime synchronization. Built with Next.js 14 (App Router), Supabase (Auth, Postgres, Realtime, RLS), and Tailwind CSS.

## 📌 Project Overview

This application allows users to:
- **Sign up/Login** securely via Google OAuth.
- **Save Bookmarks** with a title and URL.
- **Manage Collection**: View and delete personal bookmarks.
- **Live Sync**: Experience realtime updates across multiple tabs/devices without refreshing.
- **Privacy First**: Strict data isolation using Row Level Security (RLS).

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL
- **Realtime**: Supabase Realtime Channels
- **Deployment**: Vercel

## 🔐 Security Implementation (RLS)

Security is enforcing at the database level using **Row Level Security (RLS)**.

- **SELECT**: Users can only Query rows where `user_id` matches their `auth.uid()`.
- **INSERT**: Users can only Insert rows where `user_id` matches their `auth.uid()`.
- **DELETE**: Users can only Delete rows where `user_id` matches their `auth.uid()`.

This ensures that even if the frontend code is modified, User A cannot access or modify User B's data.

## ⚡ Realtime Explanation

The app uses Supabase Realtime to push changes to the client instantly.

1.  **Subscription**: The `BookmarkList` component subscribes to the `bookmarks` table.
2.  **Filtering**: The subscription is strictly filtered by `user_id` (`filter: "user_id=eq.${user.id}"`). This ensures users only receive events relevant to them.
3.  **State Update**:
    - **INSERT**: New bookmark is prepended to the local state.
    - **DELETE**: Deleted bookmark is filtered out of the local state.

## 🚧 Challenges & Solutions

### 1. Realtime Security & RLS
*Challenge*: RLS policies prevented realtime events from broadcasting to clients initially.
*Solution*: Realtime subscriptions must include the same filter logic (`user_id=eq.ID`) as the RLS policy to be authorized.

### 2. Duplicate Events
*Challenge*: React strict mode or rapid network changes caused duplicate bookmark entries.
*Solution*: Implemented client-side deduplication checks (`if (current.some(b => b.id === newBookmark.id)) return current;`) before updating state.

### 3. Google OAuth Redirects
*Challenge*: Configuring correct redirect URLs for both Localhost and Production.
*Solution*: Used dynamic `window.location.origin` or configured `NEXT_PUBLIC_SITE_URL` env var to handle redirects gracefully in both environments.

## 🧪 How to Run Locally

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd smart-bookmark-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    - Create a `.env.local` file.
    - Add your Supabase keys (see `ENV_VARS.md`).

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## 🌍 Deployment Steps (Vercel)

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the **Environment Variables** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel Settings.
4.  **Important**: Add your Vercel deployment domain (e.g., `https://your-app.vercel.app`) to your **Supabase Auth -> URL Configuration -> Redirect URLs**.
5.  Deploy!
