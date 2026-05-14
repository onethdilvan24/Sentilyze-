# Sentilyze — User Guide

**Sentilyze** is a web application for **AI-assisted market sentiment analysis**. It combines recent news (via [NewsAPI](https://newsapi.org/)) with an OpenAI model to produce sentiment summaries, trading-style signals (BUY / SELL / HOLD), and per-article impact scores. User accounts and protected areas use [Clerk](https://clerk.com/); data is stored in [Supabase](https://supabase.com/) (PostgreSQL with row-level security).

This guide covers **minimum platform requirements**, **local installation for demonstration**, and **how to use the product**.

---

## 1. Minimum platform specification (demonstration)

These are the **minimum** expectations for running the app locally for a demo. More CPU/RAM improves build times and responsiveness but is not strictly required.

| Area | Minimum |
|------|---------|
| **Operating system** | Windows 10/11, macOS 12+, or a current Linux distribution (e.g. Ubuntu 22.04 LTS) |
| **Processor** | 64-bit CPU, 2 logical cores |
| **Memory** | 4 GB RAM (8 GB recommended while running the dev server and a browser) |
| **Disk** | ~500 MB free for dependencies and build artifacts (excluding Node itself) |
| **Node.js** | **20.x LTS** (matches project CI) |
| **Package manager** | **npm** 10+ (bundled with Node 20) |
| **Browser** | A current Chromium-based, Firefox, or Safari browser (JavaScript enabled) |
| **Network** | Stable internet access for Clerk, Supabase, NewsAPI, and OpenAI during analysis |

**Note:** The analysis feature calls external APIs. Corporate firewalls or strict proxy rules may block `api.openai.com` or `newsapi.org`.

---

## 2. What you need before installation

1. **Clerk** application — publishable and secret API keys for Next.js.  
2. **Supabase** project — project URL and keys. The app code expects a **publishable** Supabase key variable as documented below (Supabase’s “anon” public key is typically used here).  
3. **NewsAPI** API key — from [newsapi.org](https://newsapi.org/) (developer plan constraints may apply; some plans restrict use to **localhost** only).  
4. **OpenAI** API key — with access to the `gpt-4o-mini` model (or ensure your account can call the Chat Completions API used by the app).

---

## 3. Installing for demonstration (local)

### 3.1 Get the code

Clone the repository and open a terminal in the app folder:

```text
<repository root>/frontend/sentilyze
```

### 3.2 Install dependencies

From `frontend/sentilyze`:

```bash
npm ci --legacy-peer-deps
```

If you do not have a lockfile workflow, you can use:

```bash
npm install --legacy-peer-deps
```

The project’s automated build uses `--legacy-peer-deps` to resolve peer dependency constraints.

### 3.3 Environment variables

Create a file named **`.env.local`** in `frontend/sentilyze` (this file is not committed to git). Set at least:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (browser) |
| `CLERK_SECRET_KEY` | Clerk secret key (server) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase public / anon key used by the app client and server helpers |
| `NEWSAPI_KEY` | NewsAPI key for `/api/analyze` |
| `OPENAI_API_KEY` | OpenAI key for `/api/analyze` |

**Important:** After creating or changing `.env.local`, **restart** the development server.

Placeholders such as `YOUR_NEWSAPI_KEY` or keys starting with `your_` are treated as unset; analysis will return an error until real keys are provided.

Some deployments document `NEXT_PUBLIC_SUPABASE_ANON_KEY`; this codebase reads **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** — use that name, with your Supabase **anon/public** key as the value.

### 3.4 Supabase: schema and Clerk third-party auth

1. Apply the SQL schema — run the statements in [`frontend/sentilyze/supabase/migrations/0001_init.sql`](frontend/sentilyze/supabase/migrations/0001_init.sql) in the Supabase **SQL Editor** (or via the Supabase CLI if you use it).  
2. Enable Clerk as a third-party auth provider in Supabase: **Authentication → Sign In / Providers → Third Party Auth → Clerk**, and paste your **Clerk Frontend API URL** (for example `https://your-instance.clerk.accounts.dev`).  
3. Save. Row-level security in the migration ties access to `auth.jwt()->>'sub'` and your Clerk user id.

### 3.5 Run the application (development)

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3.6 Production-style run (optional)

After a successful configuration:

```bash
npm run build
npm run start
```

Ensure the same environment variables are available in the process environment or your hosting provider’s dashboard.

---

## 4. How to use Sentilyze

### 4.1 Sign in

- The **landing page** (`/`) allows **Sign in** / **Sign up** via Clerk.  
- **Dashboard**, **Analysis**, **News Feed**, **Watchlist**, and **Settings** require authentication. Unauthenticated visits to those routes are redirected through Clerk’s protection.

### 4.2 Main areas (sidebar)

| Route | Typical use |
|-------|-------------|
| **Dashboard** (`/dashboard`) | Overview-style entry point after login |
| **Analysis** (`/Analysis`) | Enter a **symbol or search keyword**. The app fetches recent news, runs AI analysis, and shows sentiment, signal, scores, summary, and article-level breakdown. Successful runs **persist** to Supabase (`analyses`, `analysis_news_items`) when RLS allows. |
| **News Feed** (`/news-feed`) | Aggregated news view derived from stored analysis data (and related sources in the schema) |
| **Watchlist** (`/watchlist`) | Manage tracked symbols tied to your account |
| **Settings** (`/settings`) | Account / app preferences as implemented in the UI |

### 4.3 Running an analysis

1. Go to **Analysis**.  
2. Type a ticker or topic (for example `AAPL` or `electric vehicles`) within the allowed length (1–64 characters).  
3. Submit / run analysis and wait for the API (news fetch + OpenAI).  
4. Review **overall sentiment**, **signal**, **confidence**, **AI score**, **summary**, and per-article rows. Use **recent analyses** where available to reopen past runs.

If no articles are returned, try a broader keyword or verify your NewsAPI key and plan limits.

---

## 5. Troubleshooting (demonstrations)

| Symptom | Things to check |
|---------|-------------------|
| “Add real API keys in .env.local” | Set valid `NEWSAPI_KEY` and `OPENAI_API_KEY`; restart `npm run dev`. |
| Supabase permission / empty data errors | Clerk third-party JWT integration enabled; migration applied; `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` matches the anon key for that project. |
| News API failures | Plan limits, key validity, or **localhost-only** restrictions on developer tiers. |
| Build/install issues | Node **20.x**; retry with `npm ci --legacy-peer-deps` from `frontend/sentilyze`. |

---

## 6. Disclaimer

Signals and sentiment output are **informational only** — not financial, legal, or investment advice. Always verify information independently before making decisions.
