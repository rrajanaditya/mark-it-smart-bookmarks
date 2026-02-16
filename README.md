# MarkIt

A bookmarking application built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. MarkIt is designed for speed and aesthetics, allowing users to save, edit, and sync their digital library in real-time across all devices.

## Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Database & Auth:** Supabase (PostgreSQL)
* **Realtime:** Supabase WebSockets (PostgreSQL CDC)
* **Styling:** Tailwind CSS
* **Type Safety:** TypeScript

---

## The Problem-Solving Journey

As a Cybersecurity student, I prioritize understanding the underlying mechanics of the tools I use. This project presented several "silent" bugs that required deep dives into browser behavior and database internals.

### 1. The Chrome WebSocket "Race Condition"
**The Problem:** Realtime `INSERT` events were broadcasting perfectly on Safari but were failing on Chrome. `DELETE` events worked on both, but new bookmarks would only appear in Chrome after a manual refresh.

**The Solution:** Using Chrome's Network inspector, I discovered that Chrome was establishing the WebSocket connection *before* the Supabase session had fully hydrated from LocalStorage. Because the Realtime filter was checking for `user_id = eq.${userId}`, and `userId` was null for a split second during connection, the server ignored the client's request.
**Fix:** I implemented a session guard that prevents the Realtime subscription from initiating until the `userId` is confirmed and valid.

### 2. The "Payload Null" Delete Bug
**The Problem:** When deleting a bookmark, the Realtime event fired, but the payload returned `null` for the data, preventing the UI from knowing which card to remove.


**The Solution:** By default, PostgreSQL only logs the Primary Key for deletions to save space in the Write-Ahead Log (WAL). To get the full context of a deleted row in Realtime, I had to manually adjust the table's replication identity.
**Fix:** Executed `ALTER TABLE bookmarks REPLICA IDENTITY FULL;` in the SQL editor.


##  Key Features

* **Realtime Sync:** Instant UI updates across all tabs using PostgreSQL Change Data Capture.
* **Google OAuth:** Secure login with automatic profile image fetching and a dynamic letter-fallback system.
* **Inline Editing:** Edit titles and URLs directly within the card—no intrusive modals needed.

---

## 🛠 Installation & Local Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/rrajanaditya/markit.git](https://github.com/rrajanaditya/markit.git)
    cd markit
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
    ```

4.  **Database Migration:**
    Run this in your Supabase SQL Editor:
    ```sql
    CREATE TABLE bookmarks (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at timestamptz DEFAULT now(),
      title text NOT NULL,
      url text NOT NULL,
      user_id uuid DEFAULT auth.uid() NOT NULL
    );

    ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
    ALTER TABLE bookmarks REPLICA IDENTITY FULL;

    ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage their own bookmarks" ON bookmarks
      FOR ALL USING (auth.uid() = user_id);
    ```

---

## 📜 License
MIT © Aditya Rangarajan