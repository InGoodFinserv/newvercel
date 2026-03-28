# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready

## 2. Run the Migration

1. Go to the **SQL Editor** in your Supabase dashboard
2. Copy the contents of `migrations/001_initial_schema.sql`
3. Paste and run the SQL

This will:
- Create the `contents` table with proper types and indexes
- Set up Row Level Security (RLS) policies
- Seed the database with sample blog posts, press releases, and pages

## 3. Create the Demo Admin User

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `demo@luminapress.com`
   - Password: `password123`
4. Click **Create User**

## 4. Configure Environment Variables

Update the `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in **Settings** → **API** in your Supabase dashboard.

## 5. Run the Application

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the site.
Visit `http://localhost:5173/admin/login` to access the admin dashboard.
