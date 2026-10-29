# yStashy

A self-hosted read-later app for one person. Paste text that contains links, and yStashy saves each link with the page's title and preview image, shown as a grid of cards.

## Features

- Paste any text, such as a list or a chat log. Every `http://`, `https://` and `www.` URL in it is saved. A URL that is already saved, or whose page cannot be fetched, is listed as failed instead
- The title and image come from the page's Open Graph tags. Without `og:title`, the page's `<title>` is used
- Mark a link as read, archive it or delete it
- Sign in with GitHub. Only the account set in `ADMIN_GITHUB_ID` can add or change links

## Requirements

- Node.js 20 or later
- A [Turso](https://turso.tech/) database
- A [GitHub OAuth app](https://github.com/settings/developers). Set its callback URL to `<site URL>/api/auth/callback/github`, such as `http://localhost:3000/api/auth/callback/github` for local use

## Setup

Create `.env.local` in the repository root:

```bash
TURSO_DATABASE_URL=<URL from `turso db show <database> --url`>
TURSO_AUTH_TOKEN=<token from `turso db tokens create <database>`>
AUTH_SECRET=<random string, such as the output of `openssl rand -base64 32`>
GITHUB_CLIENT_ID=<OAuth app client ID>
GITHUB_CLIENT_SECRET=<OAuth app client secret>
ADMIN_GITHUB_ID=<your numeric GitHub user ID, from `gh api users/<login> --jq .id`>
```

Then install the dependencies, create the table and start the development server:

```bash
npm ci
npx drizzle-kit migrate
npm run dev
```

Open http://localhost:3000 and sign in with the GitHub account set in `ADMIN_GITHUB_ID`.

## Notes

- The list of saved links is public. Anyone who opens the site sees it without signing in, and `robots.txt` allows search engines to crawl it
- The site URL `https://stash.ycookiey.com` is written in `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts` and the User-Agent in `src/lib/scraper.ts`. Replace it with your own URL before you deploy
- If `ADMIN_GITHUB_ID` is not set, any GitHub account can sign in, but no one can add or change links
- The app connects to the database with the web client of libSQL, which accepts `libsql:`, `https:`, `http:`, `wss:` and `ws:` URLs but not `file:`
- The pages run on the Edge runtime. `wrangler.toml` and `npm run pages:build` are set up for Cloudflare Pages with `@cloudflare/next-on-pages`, which does not work reliably on Windows

## Build

```bash
npm ci
npm run build
```

## License

[MIT License](LICENSE)
