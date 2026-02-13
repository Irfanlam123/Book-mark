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

## 🚧 Problems Faced & Solutions

### 1. Cross-user data leak
*Problem*: Fetching all bookmarks without a user filter relies entirely on RLS, which can be risky if policies are disabled.
*Fix*: Changed query to `.select("*").eq("user_id", user.id)` to strictly filter data at the application level as well.

### 2. Realtime not working
*Problem*: Realtime updates requires the publication to be enabled for the specific table, which was missing.
*Fix*: Ran `alter publication supabase_realtime add table bookmarks;` and ensured client-side subscription filters by `user_id`.

### 3. Missing user_id in insert
*Problem*: Inserting data without `user_id` caused RLS violations or orphaned data.
*Fix*: Updated `bookmark-form.tsx` to explicitly include `user_id: user.id` in the insert payload.

### 4. Server component fetching global data
*Problem*: Fetching data in a Server Component without proper context or filters could lead to caching issues or data leaks.
*Fix*: Moved data fetching to the Client Component (`bookmark-list.tsx`) within a `useEffect`, ensuring it only runs for the authenticated user on the client.

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
