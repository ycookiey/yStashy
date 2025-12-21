# Stash - セットアップガイド

## 環境変数

`.env.local` ファイルをプロジェクトルートに作成し、以下の変数を設定してください：

```bash
# Database (Turso)
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Auth.js
AUTH_SECRET=your-auth-secret-generate-with-openssl-rand
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# Admin Control
ADMIN_GITHUB_ID=your-github-user-id
```

### 各変数の取得方法

#### Turso
1. [Turso](https://turso.tech/) でアカウント作成
2. データベース作成: `turso db create stash`
3. URL取得: `turso db show stash --url`
4. トークン取得: `turso db tokens create stash`

#### GitHub OAuth
1. GitHub > Settings > Developer settings > OAuth Apps
2. New OAuth App を作成
3. Callback URL: `http://localhost:3000/api/auth/callback/github` (開発用)

#### AUTH_SECRET
```bash
openssl rand -base64 32
```

#### ADMIN_GITHUB_ID
GitHubプロフィールページのURLから確認、または GitHub API を使用

## データベースマイグレーション

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

## 開発サーバー起動

```bash
npm run dev
```

## Cloudflare Pages デプロイ

1. GitHubリポジトリをCloudflare Pagesに接続
2. ビルドコマンド: `npm run build`
3. 出力ディレクトリ: `.next`
4. 環境変数を設定
