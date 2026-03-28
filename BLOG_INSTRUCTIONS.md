# Blog Instructions for Beginners

This guide will help you understand how to use and customize this website for different clients.

## Table of Contents
1. [Website Structure](#website-structure)
2. [How to Change Homepage Content](#how-to-change-homepage-content)
3. [How to Change Colors](#how-to-change-colors)
4. [How to Change Branding](#how-to-change-branding)
5. [How to Add Blog Posts](#how-to-add-blog-posts)
6. [How to Add Press Releases](#how-to-add-press-releases)
7. [How to Add Static Pages](#how-to-add-static-pages)
8. [SEO Settings](#seo-settings)
9. [File Structure Reference](#file-structure-reference)

---

## Website Structure

The website has these main parts:
- **Header** - Logo and navigation (same on all pages)
- **Footer** - Copyright info (same on all pages)
- **Homepage** - Static content you can customize
- **Blog** - Dynamic blog posts
- **Press** - Dynamic press releases
- **Pages** - Dynamic static pages
- **Admin** - Where you manage content

---

## How to Change Homepage Content

**File:** `src/pages/HomePage.tsx`

The homepage is a static page with these sections:
1. **Hero Section** - Main heading and description
2. **About Section** - About the company
3. **Features Section** - Product features
4. **Social Section** - Social media links

**To change content:**
1. Open `src/pages/HomePage.tsx`
2. Find the section you want to change
3. Edit the text between the `<h1>`, `<h2>`, and `<p>` tags
4. Save the file

**Example:**
```tsx
<h1>Your New Heading Here</h1>
<p>Your new description here...</p>
```

---

## How to Change Colors

**File:** `src/index.css`

The website uses a light theme with blue accents. To change colors:

1. **Background Color:**
   ```css
   body {
     background-color: #ffffff; /* Change this color */
   }
   ```

2. **Text Color:**
   ```css
   body {
     color: #000000; /* Change this color */
   }
   ```

3. **Accent Color (Blue):**
   ```css
   .accent { color: #0073e6; }
   .accent-bg { background-color: #0073e6; }
   ```

**Common Color Codes:**
- Blue: `#0073e6`
- Green: `#10b981`
- Red: `#ef4444`
- Purple: `#8b5cf6`
- Orange: `#f97316`

---

## How to Change Branding

### Change Logo
**Files:** 
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`

Find this line and change the URL:
```tsx
<img src="https://your-logo-url.com/logo.png" alt="Your Logo" />
```

### Change Website Title
**File:** `index.html`

Find this line and change it:
```html
<title>Your Website Title</title>
```

### Change Company Name
**Files:**
- `src/components/layout/Header.tsx` - Find "InGood" and change it
- `src/components/layout/Footer.tsx` - Find "InGood" and change it

---

## How to Add Blog Posts

1. Go to your website's admin panel: `yourwebsite.com/admin/login`
2. Login with your credentials
3. Click "Blog" tab
4. Click "New Content" button
5. Fill in:
   - **Title** - Your blog post title
   - **Slug** - URL-friendly version (auto-generated from title)
   - **Image URL** - Link to your featured image
   - **Body** - Your blog content (HTML supported)
   - **Description** - Short summary
   - **Keywords** - Comma-separated tags
6. Click "Create"

**Tips:**
- Use `## Heading` for subheadings in your content
- Use `**bold**` for bold text
- Use `*italic*` for italic text
- Add images with: `<img src="image-url" alt="description" />`

---

## How to Add Press Releases

1. Go to admin panel
2. Click "Press" tab
3. Click "New Content" button
4. Fill in the same fields as blog posts
5. For external links, use the "External URL" field
6. Click "Create"

---

## How to Add Static Pages

1. Go to admin panel
2. Click "Pages" tab
3. Click "New Content" button
4. Fill in the fields
5. Click "Create"

**Note:** Static pages appear at `yourwebsite.com/your-slug`

---

## SEO Settings

When creating or editing content, you can set:

1. **H1 Heading** - Main heading for SEO
2. **Meta Title** - Title shown in search results
3. **Meta Description** - Description shown in search results
4. **Meta Tags** - Comma-separated keywords
5. **Schema** - JSON-LD structured data (leave blank for default Article schema)

**Tips:**
- Keep meta titles under 60 characters
- Keep meta descriptions under 160 characters
- Use relevant keywords in your content

---

## File Structure Reference

### Homepage Customization
- `src/pages/HomePage.tsx` - Homepage content
- `src/index.css` - Colors and styles

### Branding
- `src/components/layout/Header.tsx` - Header and logo
- `src/components/layout/Footer.tsx` - Footer and logo
- `index.html` - Website title and meta tags

### Content Management
- `src/pages/admin/AdminDashboard.tsx` - Admin panel
- `src/types/content.ts` - Content types

### Pages
- `src/pages/BlogListPage.tsx` - Blog listing page
- `src/pages/BlogDetailPage.tsx` - Individual blog post page
- `src/pages/PressListPage.tsx` - Press listing page
- `src/pages/PressDetailPage.tsx` - Individual press release page
- `src/pages/StaticPage.tsx` - Static pages

---

## Quick Checklist for New Client

- [ ] Change logo in Header and Footer
- [ ] Change website title in index.html
- [ ] Change company name in Header and Footer
- [ ] Update homepage content in HomePage.tsx
- [ ] Change colors in index.css
- [ ] Update social media links in HomePage.tsx
- [ ] Update footer copyright in Footer.tsx
- [ ] Add client's content through admin panel

---

## Need Help?

If you need to make changes not covered here, check these files:
- **Layout changes:** `src/components/layout/`
- **Style changes:** `src/index.css`
- **Page changes:** `src/pages/`
- **Component changes:** `src/components/`

Remember to test your changes locally before deploying!
