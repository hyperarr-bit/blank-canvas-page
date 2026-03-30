

## Audit & Fix Plan: Supabase Security and Functionality

### Current Status

**What's already working:**
- Tables `profiles`, `subscriptions`, `user_data` created with correct schemas
- RLS enabled on all tables with appropriate SELECT/UPDATE/INSERT/DELETE policies
- Trigger `handle_new_user` to auto-create profiles on signup
- Storage bucket `skin-photos` created
- Auth flow (login/signup) implemented
- Trial system (24h) working
- User data persistence via JSONB key-value store

### Issues Found (Security Scan)

**1. CRITICAL: Skin photos publicly accessible**
The `skin-photos` bucket is public and has an anonymous SELECT policy allowing anyone to view any photo. Skin photos are sensitive data.

**Fix:** Create a migration to:
- Remove the "Public can view photos" anon policy
- Set the bucket to private (update `public` to `false`)

**2. WARN: Subscriptions table write protection**
The subscriptions table only has a SELECT policy. INSERT/UPDATE/DELETE are blocked by RLS (which is correct -- only backend/service role should manage subscriptions). No action needed, this is the intended design.

### Migration to Execute

```sql
-- Remove the public anonymous access policy on skin-photos
DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;

-- Make the bucket private
UPDATE storage.buckets SET public = false WHERE id = 'skin-photos';
```

### No Code Changes Needed

The existing code in `use-auth.tsx`, `use-user-data.tsx`, `TrialBanner.tsx`, `Auth.tsx`, and `ProtectedRoute.tsx` is already correctly wired to the Supabase tables. The `(supabase as any)` type assertions are already in place to handle the auto-generated types file.

### Summary

Only one migration is needed to fix the security vulnerability with the public skin-photos bucket. Everything else (tables, RLS policies, triggers, auth flow, trial system, data persistence) is already correctly configured.

