# AI App Catalog

社内向け生成AIアプリケーション一覧プラットフォーム

## 概要

AI App Catalogは、社内で開発・運用されている生成AIアプリケーションを一元管理し、社員が簡単に発見・利用できるプラットフォームです。

## 主な機能

- 🔍 **アプリ検索・フィルタリング**: キーワードやカテゴリでのアプリ検索
- ⭐ **評価・レビュー**: ユーザーによるアプリの評価とフィードバック
- 📊 **利用統計**: アプリの利用状況や人気度の可視化
- 👤 **個人化**: お気に入り登録や利用履歴の管理
- 🔔 **通知機能**: 新着アプリや更新情報の通知
- 📱 **レスポンシブ対応**: PC・タブレット・スマートフォン対応

## 技術スタック

- **フロントエンド**: React.js / Next.js
- **バックエンド**: Node.js / Express.js
- **データベース**: PostgreSQL
- **認証**: OAuth 2.0 / SSO
- **デプロイ**: Docker / Kubernetes
- **監視**: Prometheus / Grafana

## プロジェクト構成

```
ai_app/
├── frontend/          # フロントエンドアプリケーション
├── backend/           # バックエンドAPI
├── database/          # データベース設定・マイグレーション
├── docs/             # ドキュメント
├── scripts/          # 開発・デプロイスクリプト
├── docker/           # Docker設定
└── tests/            # テストコード
```

## セットアップ

### 必要要件

- Node.js 18.x以上
- PostgreSQL 14.x以上
- Docker & Docker Compose

### インストール手順

1. リポジトリのクローン

```bash
git clone https://github.com/kazu-dota/ai_app.git
cd ai_app
```

2. 依存関係のインストール

```bash
# フロントエンド
cd frontend
npm install

# バックエンド
cd ../backend
npm install
```

3. 環境変数の設定

```bash
cp .env.example .env
# .envファイルを編集して必要な設定を行う
```

4. データベースの起動とマイグレーション

```bash
# Dockerでデータベース起動
docker-compose up -d postgres

# マイグレーション実行
cd backend
npm run migrate
```

5. アプリケーションの起動

```bash
# バックエンド
npm run dev

# フロントエンド（別ターミナル）
cd ../frontend
npm run dev
```

アプリケーションは http://localhost:3000 でアクセス可能です。

## 開発

### 開発環境の起動

```bash
# すべてのサービスを一度に起動
docker-compose up -d

# または個別に起動
npm run dev:frontend
npm run dev:backend
```

### テストの実行

```bash
# 全テスト実行
npm run test

# フロントエンドテスト
npm run test:frontend

# バックエンドテスト
npm run test:backend

# E2Eテスト
npm run test:e2e
```

### リンターとフォーマッター

```bash
# ESLint
npm run lint

# Prettier
npm run format

# 自動修正
npm run lint:fix
```

## デプロイ

### 本番環境への デプロイ

```bash
# Docker imageのビルド
docker-compose -f docker-compose.prod.yml build

# 本番環境でのデプロイ
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetesへのデプロイ

```bash
# Kubernetesマニフェストの適用
kubectl apply -f k8s/
```

## API仕様

API仕様書は以下で確認できます：

- 開発環境: http://localhost:3001/api/docs
- Swagger UI: [API Documentation](docs/api.md)

## ライセンス

このプロジェクトは MIT License の下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## コントリビューション

コントリビューションを歓迎します！詳細は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## サポート

- 🐛 Issue報告: [GitHub Issues](https://github.com/kazu-dota/ai_app/issues)
- 💬 ディスカッション: [GitHub Discussions](https://github.com/kazu-dota/ai_app/discussions)
- 📧 お問い合わせ: [メール](mailto:support@example.com)

## 変更履歴

変更履歴は [CHANGELOG.md](CHANGELOG.md) で確認できます。

---

Made with ❤️ by Internal Development Team
