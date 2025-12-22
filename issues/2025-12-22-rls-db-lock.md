# Issue: Persistent RLS Recursion and Database Locks

**Date:** 2025-12-22  
**Status:** Mitigated (via Workaround)  
**Severity:** High (Database State) / Low (User Impact - Masked)

## 1. The Issue
We attempted to force Row Level Security (RLS) on the `profiles` table. A policy was created to allow Admins to view all profiles. However, checking if a user is an admin required querying the `profiles` table itself, which triggered the RLS policy again, creating an **Infinite Recursion**.

This recursion led to a **Database Lock** (or zombie queries) that persisted even after the code was seemingly fixed.

## 2. Symptoms
- **Frontend Hang:** `fetchUserProfile` caused a 2-5 second delay, blocking the UI.
- **Timeouts:** `AuthContext` reported `Error: Profile fetch timeout`.
- **500 Errors:** Learning Platform endpoints (`/api/learning/progress`) failed intermittently.
- **Permission Denied:** Attempting to kill the stuck connections (`pg_terminate_backend`) failed due to lack of superuser permissions.

## 3. Failed Fix Attempts
- **SQL Scripts:** Running `DROP POLICY` failed or hung because of the active locks.
- **Disabling RLS:** `ALTER TABLE profiles DISABLE ...` did not immediately clear the latency.
- **Node.js Debug:** Attempting to query `pg_policies` directly failed due to restricted system view access.

## 4. Current Workaround (The "Optimistic" Fix)
We implemented a **Service-Side Bypass** to ignore the broken database rules for the critical path.

### Backend (`index.js`)
- Switched the Supabase Client to use `SUPABASE_SERVICE_ROLE_KEY` (Superuser).
- Added a new endpoint `GET /api/auth/profile`.
- **Why:** The Service Role bypasses all RLS checks, so it ignores the recursion/locks and reads the data instantly.

### Frontend (`AuthContext.jsx`)
- **Optimistic Login:** `onAuthStateChange` immediately logs the user in (0ms delay) with a default 'authenticated' role.
- **Background Fetch:** Calls the new backend endpoint asynchronously.
- **Silent Upgrade:** If the backend returns an Admin profile, it updates the user state without blocking the UI.

## 5. Future Resolution (To Fix Root Cause)
The database is still technically "unhealthy" (locked/slow for standard connections), although the app is working fine via the workaround.

**To fix permanently:**
1. **Restart Supabase:** Go to Supabase Dashboard -> Settings -> Infrastructure -> **Restart Project**. (This kills the zombie locks).
2. **Apply Clean Policies:**
   Run this SQL to ensure no recursion exists:
   ```sql
   ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
   DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
   
   -- Simple Policy: Everyone can read details (needed for 'is_admin' checks to not recurse)
   CREATE POLICY "Public Read" ON profiles FOR SELECT USING (true);
   
   -- Secure Update: Only self
   CREATE POLICY "Self Update" ON profiles FOR UPDATE USING (auth.uid() = id);
   
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ```
