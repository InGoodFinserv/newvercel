# Lumina Press

A sleek, production-ready digital media platform featuring blogs, press releases, and static pages. Content is fully managed through a persistent Supabase database and rich admin studio.

## Features

- **Dynamic Content System**: Blog, Press Releases, and Pages stored in Supabase with full CRUD via a polished admin interface
- **Slug-based Routing**: Clean URLs driven by custom_slug (e.g. `/blog/future-of-ai`, `/about`, `/press/new-ai-platform`)
- **Blog Listing**: Pagination (6 items/page), search, reverse-chronological sort, card grid with excerpts
- **Rich Content Pages**: Hero images, metadata display (keywords), formatted body content, external links for PRs
- **Admin Dashboard**: Login (demo: `demo@luminapress.com` / `password123`), tabbed content browser, inline editor with live preview/save, delete support
- **Auth**: Full Supabase email auth + session management
- **Design**: Dark cinematic aesthetic, smooth Framer Motion animations, responsive cards, hero section, clean typography and hover states
- **SEO/UX**: Meta fields respected, proper dates, loading states, back navigation, mobile menu

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Database & Auth**: Supabase

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd my-content-site
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/migrations/001_initial_schema.sql` in the SQL Editor
3. Create a demo admin user (`demo@luminapress.com` / `password123`) in Authentication → Users

See [`supabase/README.md`](supabase/README.md) for detailed instructions.

### 3. Configure Environment

Update `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run

```bash
npm run dev
```

- Site: `http://localhost:5173`
- Admin: `http://localhost:5173/admin/login`

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout, ProtectedRoute
│   └── ui/              # ContentCard, LoadingSpinner, Pagination
├── context/             # AuthContext (Supabase auth)
├── hooks/               # useContentList, useContent, useAdmin
├── lib/                 # Supabase client
├── pages/
│   ├── admin/           # AdminLogin, AdminDashboard
│   ├── HomePage.tsx
│   ├── BlogListPage.tsx
│   ├── BlogDetailPage.tsx
│   ├── PressListPage.tsx
│   ├── PressDetailPage.tsx
│   ├── StaticPage.tsx
│   └── NotFoundPage.tsx
├── types/               # TypeScript interfaces
├── App.tsx              # Route configuration
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home page with hero and featured content |
| `/blog` | Blog listing with search and pagination |
| `/blog/:slug` | Individual blog post |
| `/press` | Press releases listing |
| `/press/:slug` | Individual press release |
| `/:slug` | Static pages (About, Contact, etc.) |
| `/admin/login` | Admin login page |
| `/admin` | Admin dashboard (protected) |

## License

MIT
