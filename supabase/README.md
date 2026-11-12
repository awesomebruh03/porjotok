# Supabase setup (Step 2 — draft editor)

The public site keeps working without Supabase. The admin login and content
editor need the project below.

## 1. Create the draft table

Open **Supabase → SQL Editor**, paste the contents of
[`migrations/0001_content_drafts.sql`](migrations/0001_content_drafts.sql), and
run it. It creates `public.content_drafts` and restricts it to users whose
`app_metadata.role` is `editor` or `admin`.

## 2. Create an editor account

1. **Authentication → Users → Add user**.
2. Use an email and password, and enable **Auto Confirm User** (the login form
   has no email-confirmation step).
3. Give the account the editor role in the SQL editor:

```sql
update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"editor"}'::jsonb
where email = 'editor@example.com';
```

Only `app_metadata` can be trusted in RLS; do not put the role in
`user_metadata`, which the user can edit.

## 3. Turn off public signups

**Authentication → Providers → Email** → disable **Enable sign ups**. Accounts
are created by an administrator, not self-service.

## 4. Local environment

`.env` (gitignored) must contain:

```bash
VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
```

Use the publishable/anon key, never the service-role secret. Vite inlines these
at build time.

## 5. GitHub Pages

Add the same two values as repository secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The deploy workflow passes them to `npm run build`. If they are missing, the
build still succeeds and the admin shows a setup notice instead of the login
form.

## Table shape

| column       | type        | notes                                         |
| ------------ | ----------- | --------------------------------------------- |
| `key`        | text (PK)   | content key such as `header.nav.publications` |
| `bn`         | text        | Bangla text                                   |
| `en`         | text        | English text (optional)                       |
| `href`       | text null   | link destination                              |
| `new_tab`    | boolean     | open link in a new tab                        |
| `updated_at` | timestamptz | maintained by trigger                         |
| `updated_by` | uuid        | defaults to `auth.uid()`                      |

Drafts are layered over `content/site.json` inside the admin only. Publishing
them to the public site is Step 3.
