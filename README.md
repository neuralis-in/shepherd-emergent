# Shepherd

**Trace AI agents so they don't fail.**

A clean, minimal, engineering-focused landing page for Shepherd — an AI agent observability tool powered by [aiobs](https://github.com/neuralis-in/aiobs).

## Tech Stack

- **React** — UI library
- **Vite** — Build tool
- **Framer Motion** — Animations
- **Lucide React** — Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- 🎨 Pure white, minimal design with Linear/Vercel aesthetic
- ⚡ Smooth micro-interactions with Framer Motion
- 📱 Mobile-first responsive layout
- 🔤 DM Sans + IBM Plex Mono typography
- 🎯 High-whitespace, engineering-grade UI

## Project Structure

```
src/
├── App.jsx        # Main application with all sections
├── App.css        # Component styles
├── index.css      # Global styles and CSS variables
├── main.jsx       # React entry point
public/
├── shepherd.svg   # Favicon
.github/
├── workflows/
│   ├── deploy.yml   # Deploy to GitHub Pages on main
│   └── preview.yml  # PR preview deployments
```

## Deployment

### GitHub Pages (Production)

The site automatically deploys to GitHub Pages when you push to `main`.

**Setup:**
1. Go to your repo **Settings** → **Pages**
2. Set Source to **GitHub Actions**
3. Push to `main` branch

### PR Preview (Netlify)

Every PR gets a unique preview URL automatically.

**Setup:**
1. Create a [Netlify](https://netlify.com) account
2. Create a new site (can be empty/placeholder)
3. Get your credentials:
   - **NETLIFY_AUTH_TOKEN**: Account Settings → Applications → Personal access tokens
   - **NETLIFY_SITE_ID**: Site Settings → General → Site ID
4. Add secrets to your repo: **Settings** → **Secrets and variables** → **Actions**:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`

Now every PR will get a comment with a preview link!

### Custom Domain

To use a custom domain instead of `username.github.io/repo-name`:

1. Update `vite.config.js`:
   ```js
   base: '/',  // Remove the conditional
   ```
2. Add your domain in GitHub Pages settings
3. Configure DNS with your domain provider

## License

© Shepherd, 2025
