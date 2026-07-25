# Deploying Bolt Driver Profit Calculator

This app is a standard Next.js project with **no backend and no environment
variables** — everything runs in the browser and saves to the device. That makes
deploying it very simple.

## 1. Put the code on GitHub

You need a free account at https://github.com.

**Easiest (no command line):**

1. On GitHub, click **+** (top-right) → **New repository**.
2. Name it e.g. `bolt-profit-calculator`. Public or Private both work. Do **not**
   add a README (this project already has one). Click **Create repository**.
3. On the next screen, click **“uploading an existing file”**.
4. Open this project folder, select **everything inside it** (`src`, `public`,
   `package.json`, etc. — the contents, not the outer folder), and **drag** it onto
   the upload area. Wait for the list to finish.
5. Click **Commit changes**.

> Only upload what's in this folder. Never upload a `node_modules` folder — Vercel
> installs dependencies for you.

**With Git (if installed):**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/misojj40-eng/bolt-profit-calculator.git
git push -u origin main
```

## 2. Deploy on Vercel

1. Go to https://vercel.com → **Sign Up** → **Continue with GitHub**.
2. Dashboard → **Add New… → Project**.
3. **Import** your `bolt-profit-calculator` repo. (First time, allow Vercel's GitHub
   app to access the repo.)
4. Vercel auto-detects **Next.js** — leave every setting as-is. No environment
   variables are needed.
5. Click **Deploy** and wait ~1–2 minutes.

You'll get a live URL like `https://bolt-profit-calculator.vercel.app`.

## 3. Updating later

Change any file on GitHub (or push a new commit) and Vercel automatically rebuilds
and redeploys within a minute or two.

## One-click alternative

If your repo is public, the **Deploy** button in `README.md` lets anyone (including
you) clone and deploy it to Vercel in one click.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Requires Node.js 18.18+ (Node 20 LTS recommended).
