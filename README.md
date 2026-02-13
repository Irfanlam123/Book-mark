# Smart Bookmark App 🚀

A production-ready, full-stack bookmark manager built under a strict 72-hour time constraint to demonstrate secure, real-time web application development.

## 📌 Project Overview

The **Smart Bookmark App** is a streamlined utility that allows users to save, manage, and sync their web bookmarks instantly across devices. It leverages the power of **Next.js 14**, **Supabase**, and **Tailwind CSS** to deliver a fast, responsive, and secure experience.

### Key Features
- **Secure Authentication**: Log in seamlessly using **Google OAuth**.
- **Instant Synchronization**: Add a bookmark on one device, and watch it appear instantly on another—**no refresh required**.
- **Global Realtime**: subscription persists across all dashboard pages.
- **Interactive Feedback**: Beautiful Toast notifications for all actions.
- **Strict Privacy**: Row Level Security (RLS) ensures that **User A can NEVER see User B's data**.
- **Optimized Performance**: Built with the Next.js App Router for optimal loading speeds and SEO.
- **Modern UI**: Clean, responsive interface styled with Tailwind CSS.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrue)
- **Realtime**: Supabase Realtime (WebSockets)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚧 Problems Faced & How They Were Solved

During development, several critical challenges arose. Here is how each was diagnosed and resolved:

### 1️⃣ Google OAuth “Unsupported provider” Error
**Problem:** Google login failed immediately with an "unsupported provider" message.
**Solution:**
- Enabled the Google provider in the **Supabase Dashboard**.
- Generated a new **Client ID** and **Client Secret** in Google Cloud Console.
- Configured the callback URL in Google Cloud to match Supabase's callback domain.

### 2️⃣ Redirect URI Mismatch in Production
**Problem:** Login worked perfectly on `localhost` but failed with a `redirect_uri_mismatch` error after deploying to Vercel.
**Solution:**
- Added the production Vercel domain (`https://smart-bookmark-app.vercel.app`) to:
    - **Supabase Auth -> URL Configuration -> Redirect URLs**.
    - **Google Cloud Console -> Authorized Redirect URIs**.

### 3️⃣ Cross-User Data Leakage (User A = User B)
**Problem:** A critical security flaw where users could see bookmarks belonging to others.
**Cause:** Fetching bookmarks without a strict `user_id` filter, relying solely on implied security.
**Solution:**
- Enabled **Row Level Security (RLS)** on the `bookmarks` table.
- Created strict RLS policies:
    - **SELECT**: `auth.uid() = user_id`
    - **INSERT**: `auth.uid() = user_id`
    - **DELETE**: `auth.uid() = user_id`
- Updated the frontend query to strictly filter by `.eq("user_id", user.id)` as a secondary safeguard.
- Ensured every `INSERT` operation explicitly includes the `user_id`.

### 4️⃣ Real-Time Not Updating Between Tabs
**Problem:** New bookmarks only appeared after a manual page refresh.
**Cause:**
- Realtime replication was not enabled for the `bookmarks` table.
- The subscription filter was too broad or incorrect.
- The dashboard was using a Server Component for state, which cannot receive WebSocket events.
**Solution:**
- Enabled **Replication** for the `bookmarks` table in Supabase Database settings.
- Converted the dashboard to a **Client Component** (`"use client"`).
- Implemented `supabase.channel()` listening for `postgres_changes`.
- Added a strict filter: `filter: "user_id=eq.${user.id}"` to receive only relevant events.

### 5️⃣ Duplicate Entries in Realtime
**Problem:** When a new bookmark was added, it sometimes appeared twice in the list.
**Solution:**
- Implemented a state deduplication check before appending new entries:
    ```javascript
    if (prev.some(b => b.id === payload.new.id)) return prev;
    ```
- This ensures that if the local optimistic update or a network retry triggers an event, it isn't added redundanty.

### 6️⃣ Domain & DNS Issues During Deployment
**Problem:** The custom domain was not resolving correctly, showing a generic placeholder.
**Cause:** DNS records were still pointing to the old registrar (Hostinger) defaults instead of Vercel.
**Solution:**
- Deleted default Hostinger A/CNAME records.
- Added Vercel's required records:
    - **A Record**: `76.76.21.21`
    - **CNAME**: `cname.vercel-dns.com`
- Verified propagation using `whatsmydns.net` and Vercel's domain dashboard.

### 7️⃣ Session Caching Issues
**Problem:** Switching Google accounts sometimes showed the previous user's data due to aggressive caching.
**Solution:**
- Implemented a robust sign-out flow:
    ```javascript
    await supabase.auth.signOut();
    router.refresh();
    ```
- Added a middleware to validate session tokens on every navigation.

---

## ⚡ Real-Time Implementation Methodology

The app achieves "no-refresh" updates using **Supabase Realtime**, which is built on Elixir Phoenix Channels (WebSockets).

1.  **Connection**: The client establishes a WebSocket connection to Supabase.
2.  **Channel Subscription**: `supabase.channel()` subscribes to the `bookmarks` table.
3.  **Event Filtering**: The subscription listens specifically for `INSERT` and `DELETE` events where `user_id` matches the current user.
4.  **State Update**:
    - **On INSERT**: The new payload is prepended to the React state array.
    - **On DELETE**: The item is filtered out of the state array.
5.  **Cleanup**: The channel is properly unsubscribed in the `useEffect` cleanup function to prevent memory leaks and duplicate listeners.

---

## 🔐 Security Implementation (RLS)

Security is enforcing at the database level using **Row Level Security (RLS)**. Frontend filtering is **never sufficient** securely.

-   **Why It Matters**: Even if a malicious user tries to bypass the UI and query the API directly, the database will return **zero rows** because their `auth.uid()` does not match the `user_id` of the records.
-   **Implementation**:
    ```sql
    create policy "select own"
    on bookmarks for select
    using ( auth.uid() = user_id );
    ```
    This single line guarantees true data isolation.

---

## 🚀 Deployment

The application is deployed on **Vercel** for global edge delivery.

-   **Production URL**: [https://smart-bookmark-app.vercel.app](https://smart-bookmark-app.vercel.app)
-   **Environment Variables**: Securely stored in Vercel Project Settings.
    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
-   **Integration**: Connected to GitHub for continuous deployment on push.

---

## 🧪 How to Run Locally

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/smart-bookmark-app.git
    cd smart-bookmark-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔮 Future Improvements

To further enhance the application, the following features are planned:
-   **Edit Functionality**: Allow users to update titles and URLs.
-   **Pagination**: optimize loading for users with hundreds of bookmarks.
-   **Search**: Instant client-side search across titles and descriptions.
-   **Folder Categorization**: Group bookmarks into collections.
-   **Tagging System**: Add descriptive tags for better organization.

---

*Built with ❤️ by [Your Name] using Next.js & Supabase.*
