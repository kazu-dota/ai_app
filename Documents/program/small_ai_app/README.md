# AI App Catalog 簡素化版

社内AIアプリの管理・発見を可能にする軽量プラットフォームです。最小限の機能で実用性を重視した2-3週間の短期開発プロジェクトです。

## 🚀 現在実装済みの機能

### ✅ バックエンド (FastAPI)
- JWT認証システム
- アプリ・カテゴリ・ユーザー管理API
- お気に入り・評価システムAPI
- **24個のテストケース全て通過**

### ✅ フロントエンド (React)
- ログイン・認証機能
- **アプリ一覧ページ（TDD実装完了）**
  - AppCard: アプリ情報表示（名前、説明、カテゴリ、星評価、利用回数）
  - AppList: レスポンシブグリッドレイアウト
  - AppsPage: API統合、ローディング、エラーハンドリング
- **11個のフロントエンドテスト全て通過**

## 🛠 技術スタック

### バックエンド
- **FastAPI** 0.104.1 - 高性能なPython Webフレームワーク
- **SQLAlchemy** 2.0.23 - ORM
- **SQLite** - 開発用データベース
- **JWT** - 認証システム
- **pytest** - テストフレームワーク

### フロントエンド
- **React** 19.1.0 - UIライブラリ
- **Vite** 7.0.4 - ビルドツール
- **Tailwind CSS** 4.1.11 - CSSフレームワーク
- **React Router** 7.7.0 - ルーティング
- **Axios** 1.11.0 - HTTP通信
- **Vitest + React Testing Library** - テスト環境

## 📋 必要な環境

- **Python** 3.8+
- **Node.js** 18+
- **Git**

## 🔧 セットアップ・実行方法

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd small_ai_app
```

### 2. バックエンドのセットアップ

```bash
# バックエンドディレクトリに移動
cd backend

# 仮想環境作成（推奨）
python -m venv venv

# 仮想環境アクティベート
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# 依存関係インストール
pip install -r requirements.txt

# データベース初期化
python -c "from app.database import create_tables; create_tables()"
```

### 3. フロントエンドのセットアップ

```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存関係インストール
npm install
```

## 🚀 開発サーバーの起動

### バックエンドサーバー起動

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

サーバーが起動すると：
- API: http://localhost:8000
- APIドキュメント: http://localhost:8000/docs

### フロントエンドサーバー起動

```bash
cd frontend
npm run dev
```

フロントエンドが起動すると：
- アプリケーション: http://localhost:5173

## 🧪 テスト実行

### バックエンドテスト

```bash
cd backend
pytest
```

**結果**: 24個のテスト全て通過
- 認証API: 8テスト
- アプリAPI: 8テスト
- データベースモデル: 5テスト
- メインアプリ: 3テスト

### フロントエンドテスト

```bash
cd frontend
npm test
```

**結果**: 11個のテスト全て通過
- AppCard: 5テスト
- AppList: 2テスト
- AppsPage: 4テスト

### テスト監視モード

```bash
cd frontend
npm test -- --watch
```

## 📱 使用方法

### 1. アプリケーションにアクセス
http://localhost:5173 にアクセス

### 2. ログイン
- 管理者ユーザーでログイン（テストデータがある場合）
- または新規ユーザー登録

### 3. アプリ一覧の確認
- `/apps` ページでアプリ一覧を表示
- アプリカードには以下が表示されます：
  - アプリ名と説明
  - カテゴリ
  - 星評価（平均）
  - 利用回数

## 🏗 プロジェクト構造

```
small_ai_app/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPIアプリケーション
│   │   ├── database.py      # データベース設定
│   │   ├── models.py        # SQLAlchemyモデル
│   │   ├── schemas.py       # Pydanticスキーマ
│   │   ├── auth.py          # JWT認証
│   │   └── routers/         # APIルーター
│   ├── tests/               # バックエンドテスト
│   └── requirements.txt     # Python依存関係
├── frontend/
│   ├── src/
│   │   ├── components/      # Reactコンポーネント
│   │   │   ├── apps/       # アプリ関連コンポーネント
│   │   │   └── common/     # 共通コンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── services/       # API通信
│   │   ├── context/        # Reactコンテキスト
│   │   └── test/           # テスト設定
│   ├── package.json        # Node.js依存関係
│   └── vite.config.js      # Vite設定
├── CLAUDE.md               # プロジェクト設定
└── README.md               # このファイル
```

## 🎯 実装予定の機能

### 次期実装予定
1. **お気に入り機能**
   - FavoriteButtonコンポーネント
   - お気に入りページ
   - お気に入り状態管理

2. **アプリ詳細ページ**
   - アプリ詳細情報表示
   - 評価投稿機能
   - 利用カウント機能

3. **検索・フィルター機能**
   - アプリ名での検索
   - カテゴリフィルター
   - 評価ソート

## 🐛 トラブルシューティング

### よくある問題

#### バックエンドが起動しない
```bash
# 仮想環境がアクティベートされているか確認
which python  # 仮想環境のpythonを指しているかチェック

# 依存関係の再インストール
pip install -r requirements.txt --force-reinstall
```

#### フロントエンドが起動しない
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

#### テストが失敗する
```bash
# バックエンド: テスト用データベースをクリア
rm -f test*.db

# フロントエンド: キャッシュクリア
npm test -- --no-cache
```

## 📝 開発メモ

### データベースリセット
```bash
cd backend
rm -f app.db test*.db
python -c "from app.database import create_tables; create_tables()"
```

### 本番ビルド
```bash
cd frontend
npm run build
```

## 🤝 開発方針

このプロジェクトは **テスト駆動開発（TDD）** で進めています：

1. テストリスト作成
2. 失敗するテスト実装
3. 最小限のプロダクトコード実装
4. リファクタリング
5. 次のテストへ

### コミット規約
- `feat:` - 新機能
- `fix:` - バグ修正
- `test:` - テスト追加・修正
- `refactor:` - リファクタリング

## 📄 ライセンス

このプロジェクトは社内開発用です。

---

**開発状況**: アプリ一覧機能実装完了（TDD）  
**次のマイルストーン**: お気に入り機能実装