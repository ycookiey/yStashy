# 要件定義書：Stash (Personal Read-Later App)

## 1. プロジェクト概要
### 1.1 サービス名・URL
*   **サービス名**: **Stash** (スタッシュ)
*   **デプロイ先**: `https://stash.ycookiey.com` (Cloudflare Pages)

### 1.2 目的
気になったWeb記事のURLを一時的に「退避（Stash）」し、視覚的に管理する個人用ブックマークアプリ。

### 1.3 ユーザーと権限
*   **管理者（あなた）**:
    *   特定のGitHubアカウントでのみログイン可能。
    *   記事の追加、編集、削除が可能。
*   **一般閲覧者（誰でも）**:
    *   ログイン不要で、記事一覧の閲覧が可能。
    *   編集機能へのアクセスは不可。

---

## 2. システム構成 (Tech Stack)

Cloudflareのエッジ環境とTursoを活用し、**「維持費ゼロ・高速・低レイテンシ」**を実現する。

| カテゴリ | 技術選定 | 詳細設定 |
| :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | フルスタックフレームワーク。 |
| **Hosting** | **Cloudflare Pages** | GitHub連携による自動デプロイ。Edge Runtimeで動作。 |
| **Database** | **Turso (libSQL)** | HTTP経由でEdgeから接続。無料枠が大きく個人開発に最適。 |
| **ORM** | **Drizzle ORM** | TypeScript対応、マイグレーション管理。 |
| **Auth** | **Auth.js (v5)** | GitHub Provider。**JWTセッション**管理。 |
| **Styling** | **Tailwind CSS** | ユーティリティファーストCSS。 |
| **Scraping** | **cheerio** | 軽量HTMLパーサー（EdgeでのOGP取得用）。 |

---

## 3. 機能要件詳細

### 3.1 認証機能 (Authentication)
*   **GitHub OAuthログイン**:
    *   管理者のみがログインして編集モードに入れる。
*   **ホワイトリスト制御**:
    *   環境変数 `ADMIN_GITHUB_ID` に設定されたID以外は、ログイン試行時に弾く（または閲覧権限のみとする）。
*   **セッション永続化**:
    *   JWT方式を採用（DBアクセス節約）。
    *   `maxAge` を30日間に設定し、ブラウザを閉じても再ログイン不要とする。

### 3.2 記事追加 (Stash Action)
**UXの核となる機能**。ユーザーの操作を最小限にする。

1.  **入力**: 管理者がトップ画面のフォームに **URLのみ** を貼り付けて送信。
2.  **自動処理（Server Action / Edge）**:
    *   入力されたURLへアクセスしHTMLを取得（User-AgentはBotとして偽装）。
    *   `cheerio` を用いて以下の優先順位で情報を抽出。
        *   **Title**: `og:title` > `<title>` > URLそのもの
        *   **Description**: `og:description` > `meta[name="description"]` > 空文字
        *   **Image**: `og:image` > `null`
3.  **保存**: 抽出データとURLをTursoへINSERT。
4.  **フィードバック**: 画面をリフレッシュし、新着記事を表示。

### 3.3 記事閲覧 (Public View)
*   **グリッド表示**: OGP画像、タイトル、ドメイン名をカード形式で表示。
*   **画像処理**:
    *   `next/image` は使用不可（Cloudflare制限）。
    *   通常の `<img>` タグを使用し、CSS (`aspect-ratio`) でレイアウトシフトを防ぐ。
    *   画像がない記事は、デフォルトのプレースホルダー画像またはCSSパターンを表示。
*   **リンク遷移**: カード全体をクリックすると、元記事を別タブ (`target="_blank"`) で開く。

### 3.4 記事管理 (Admin Features)
*   **編集**: 自動取得したタイトルの修正、メモの追記、ステータス変更。
*   **削除**: 不要になった記事の削除。
*   **ステータス管理**: 未読 (Unread) / 既読 (Read) / アーカイブ (Archived)。

---

## 4. データベース設計 (Schema)

**Tables: `articles`**

| Column Name | Type (SQLite) | Description |
| :--- | :--- | :--- |
| `id` | TEXT | UUID (Primary Key) |
| `url` | TEXT | 記事URL（必須） |
| `title` | TEXT | 記事タイトル |
| `description` | TEXT | 記事概要 |
| `image_url` | TEXT | サムネイル画像URL |
| `status` | TEXT | 'unread' (default), 'read', 'archived' |
| `created_at` | INTEGER | UNIX Timestamp / Date |
| `updated_at` | INTEGER | 更新日時 |

---

## 5. UI/UX 構成案

### 5.1 トップページ (`/`)
*   **Header**:
    *   左: Logo "Stash"
    *   右: [Login] (未ログイン時) / [Avatar Icon] (管理者時)
*   **Input Area** (管理者かつログイン時のみ表示):
    *   シンプルで大きな入力フォーム。「URLをペースト...」
    *   [Stash] ボタン。
*   **Content Area**:
    *   記事カードがレスポンシブグリッドで並ぶ。

### 5.2 編集モーダル
*   カード上の「︙」メニュー等から起動。
*   タイトル修正フォーム、削除ボタンを配置。

---

## 6. 開発ステップ

1.  **Init**: Next.js + Tailwind プロジェクト作成。
2.  **DB Setup**: Turso DB作成、Drizzle設定、スキーマ適用。
3.  **Auth Setup**: Auth.js導入、GitHub IDホワイトリスト実装、JWT30日設定。
4.  **Core Logic**: URLを受け取り `cheerio` で解析してDBに入れるServer Actionの実装。
5.  **UI Build**: 一覧表示、入力フォームの作成。
6.  **Deploy**: GitHubへPushし、Cloudflare Pagesへデプロイ。ドメイン `stash.ycookiey.com` 設定。