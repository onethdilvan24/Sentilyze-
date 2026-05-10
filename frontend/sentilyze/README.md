This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase + Clerk integration

This project uses Supabase as the database and Clerk for auth, bridged via Clerk's
**native Supabase third-party auth integration** (Clerk session JWT is forwarded to
Supabase, and RLS policies match `auth.jwt()->>'sub'` against `clerk_user_id`).

One-time setup (required for RLS to allow reads/writes):

1. In the Supabase dashboard go to **Authentication → Sign In / Providers → Third Party Auth**.
2. Enable **Clerk** and paste your Clerk Frontend API URL (e.g.
   `https://mutual-aardvark-48.clerk.accounts.dev`).
3. Save. No JWT template configuration is needed in Clerk for the native integration.

Schema lives in [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
and was applied via the Supabase MCP `apply_migration` tool. To re-apply manually,
run that file in the Supabase SQL editor.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
