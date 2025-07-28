# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Global Configuration
常に日本語で返答してください
適切な粒度で、githubへのコミット、プッシュを実行してください。
t_wadaのテスト駆動の手法で開発してください。

テスト駆動開発の定義は以下です。

1. 網羅したいテストシナリオのリスト（テストリスト）を書く
2. テストリストの中から「ひとつだけ」選び出し、実際に、具体的で、実行可能なテストコードに翻訳し、テストが失敗することを確認する
3. プロダクトコードを変更し、いま書いたテスト（と、それまでに書いたすべてのテスト）を成功させる（その過程で気づいたことはテストリストに追加する）
4. 必要に応じてリファクタリングを行い、実装の設計を改善する
テストリストが空になるまでステップ2に戻って繰り返す

## Project Overview

AI App Catalog 簡素化版は、社内AIアプリの管理・発見を可能にする軽量プラットフォームです。
最小限の機能で実用性を重視した2-3週間の短期開発プロジェクトです。

## Architecture

- **Frontend**: React 18 + Vite, Tailwind CSS, React Router, Axios
- **Backend**: FastAPI + SQLAlchemy, JWT認証, SQLite/PostgreSQL
- **開発期間**: 2-3週間の短期開発を想定

## Common Commands

### Development

```bash
# バックエンド起動（FastAPI）
cd backend
uvicorn app.main:app --reload --port 8000

# フロントエンド起動（React + Vite）
cd frontend
npm run dev

# 開発環境セットアップ
pip install -r backend/requirements.txt
npm install --prefix frontend
```

### Database

```bash
# データベース初期化（SQLite）
cd backend
python -c "from app.database import create_tables; create_tables()"

# PostgreSQL使用時
# 環境変数 DATABASE_URL を設定
```

### Testing

```bash
# バックエンドテスト
cd backend
pytest

# フロントエンドテスト
cd frontend
npm test
```

### Production (Docker Compose)

```bash
docker-compose up -d
```

## 簡素化された機能範囲

### 核心機能（MVP）- **2025年1月更新**
1. **✅ アプリ一覧・詳細表示** - 実装完了
2. **✅ 基本検索・カテゴリフィルタ** - 実装完了（デバウンス、リアルタイム検索）
3. **✅ お気に入り機能** - 実装完了（フロントエンド、ローカルストレージ）
4. **🔄 簡単な評価システム（星評価のみ）** - バックエンドのみ実装済み
5. **🔄 基本的なユーザー管理** - バックエンドのみ実装済み

### 削除された機能
- 複雑な権限管理（super_admin削除）
- 通知システム
- タグシステム
- 詳細な使用統計・セッション管理
- CSVエクスポート
- 高度な検索（全文検索）
- Redisキャッシュ
- レビューコメント（星評価のみ）

## Key Architecture Patterns

### Frontend Structure (React) - **2025年1月更新**

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Header, Footer, LoadingSpinner, ErrorMessage
│   │   ├── apps/            # AppCard（リニューアル）, AppList（Grid対応）, AppSearch（新規）
│   │   └── favorites/       # （統合済み - AppCardに組み込み）
│   ├── pages/               # HomePage（ロゴ調整）, AppsPage（検索統合）
│   ├── hooks/               # useAppSearch（新規）, useFavorites（新規）
│   ├── utils/               # debounce.js（新規）
│   ├── services/            # api.js
│   ├── context/             # （認証削除）
│   └── test/                # setup.js, テストファイル群
```

### Backend Structure (FastAPI)

```
backend/
├── app/
│   ├── main.py              # FastAPI アプリケーション
│   ├── database.py          # データベース接続
│   ├── auth.py              # 認証・認可
│   ├── models.py            # SQLAlchemyモデル
│   ├── schemas.py           # Pydanticスキーマ
│   ├── crud.py              # データベース操作
│   └── routers/
│       ├── apps.py          # アプリ関連API
│       ├── auth.py          # 認証API
│       ├── users.py         # ユーザー関連API
│       ├── categories.py    # カテゴリAPI
│       └── favorites.py     # お気に入りAPI
```

### Database Schema（簡素化版）

主要テーブル:
- **users**: email, name, department, role (user/admin)
- **categories**: name, description, color
- **apps**: name, description, category_id, status, url, usage_count, avg_rating
- **favorites**: user_id, app_id の関連
- **ratings**: app_id, user_id, rating (1-5)

### API Endpoints

#### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/register` - 登録（管理者のみ）
- `GET /api/auth/me` - 現在のユーザー情報

#### アプリ管理
- `GET /api/apps` - アプリ一覧（search, category_id, pageパラメータ）
- `GET /api/apps/{app_id}` - アプリ詳細
- `POST /api/apps` - アプリ作成（管理者のみ）
- `PUT /api/apps/{app_id}` - アプリ更新
- `POST /api/apps/{app_id}/use` - 利用カウント

#### お気に入り・評価
- `GET /api/favorites` - お気に入り一覧
- `POST /api/favorites` - お気に入り追加
- `DELETE /api/favorites/{app_id}` - お気に入り削除
- `POST /api/apps/{app_id}/rate` - 評価投稿・更新

## Development Notes

### Environment Setup

#### 必要な環境
- **Python**: 3.8+ (FastAPI)
- **Node.js**: 18+ (React + Vite)
- **Database**: SQLite（開発用）または PostgreSQL（本番用）

#### 主要依存関係
```python
# backend/requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
bcrypt==4.1.2
```

```json
# frontend/package.json dependencies - 2025年1月更新
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0", 
  "react-router-dom": "^7.7.0",
  "axios": "^1.11.0",
  "tailwindcss": "^3.4.17",
  "@heroicons/react": "^2.2.0"
}
```

### 認証・認可

- **JWT認証**: localStorage保存（簡易版）
- **役割**: user/admin のみ（super_admin削除）
- **トークン有効期限**: 30分

### 開発スケジュール

#### Phase 1: 基盤構築（3-4日）
- FastAPI セットアップ
- データベース設計・マイグレーション
- 基本認証実装
- React プロジェクトセットアップ

#### Phase 2: 核心機能（5-7日）
- アプリCRUD API
- フロントエンドアプリ一覧・詳細
- 検索・フィルタ機能
- お気に入り機能

#### Phase 3: 仕上げ（3-4日）
- 評価システム
- UI/UX改善
- テスト・デバッグ
- デプロイ準備
