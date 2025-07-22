# データベース設計書

## ER図

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │   AI_Apps   │       │ Categories  │
├─────────────┤   ┌───├─────────────┤───────├─────────────┤
│ id (PK)     │   │   │ id (PK)     │       │ id (PK)     │
│ email       │   │   │ name        │       │ name        │
│ name        │   │   │ description │       │ type        │
│ department  │   │   │ category_id │───────│ created_at  │
│ role        │   │   │ creator_id  │───┐   │ updated_at  │
│ created_at  │   │   │ status      │   │   └─────────────┘
│ updated_at  │   │   │ url         │   │
└─────────────┘   │   │ api_info    │   │   ┌─────────────┐
                  │   │ tech_stack  │   │   │   Reviews   │
┌─────────────┐   │   │ usage_count │   └───├─────────────┤
│  Favorites  │   │   │ avg_rating  │       │ id (PK)     │
├─────────────┤   │   │ created_at  │       │ app_id (FK) │
│ id (PK)     │   │   │ updated_at  │       │ user_id (FK)│
│ user_id (FK)│───┘   └─────────────┘       │ rating      │
│ app_id (FK) │                             │ comment     │
│ created_at  │       ┌─────────────┐       │ created_at  │
└─────────────┘       │ Usage_Logs  │       │ updated_at  │
                      ├─────────────┤       └─────────────┘
┌─────────────┐       │ id (PK)     │
│Notifications│       │ app_id (FK) │───┐
├─────────────┤       │ user_id (FK)│───┘
│ id (PK)     │       │ action_type │
│ user_id (FK)│───┐   │ created_at  │
│ type        │   │   └─────────────┘
│ title       │   │
│ message     │   │   ┌─────────────┐
│ is_read     │   │   │   Tags      │
│ created_at  │   │   ├─────────────┤
└─────────────┘   │   │ id (PK)     │
                  │   │ name        │
                  │   │ color       │
                  │   │ created_at  │
                  │   └─────────────┘
                  │
                  │   ┌─────────────┐
                  │   │  App_Tags   │
                  │   ├─────────────┤
                  │   │ app_id (FK) │
                  │   │ tag_id (FK) │
                  │   │ created_at  │
                  └───└─────────────┘
```

## テーブル設計

### 1. users - ユーザー情報

| Column     | Type         | Null | Default | Description        |
|------------|--------------|------|---------|-------------------|
| id         | SERIAL       | NO   |         | ユーザーID (主キー)    |
| email      | VARCHAR(255) | NO   |         | メールアドレス          |
| name       | VARCHAR(100) | NO   |         | ユーザー名             |
| department | VARCHAR(100) | YES  |         | 所属部署              |
| role       | VARCHAR(20)  | NO   | 'user'  | ロール (user/admin/super_admin) |
| avatar_url | TEXT         | YES  |         | アバター画像URL        |
| created_at | TIMESTAMP    | NO   | NOW()   | 作成日時              |
| updated_at | TIMESTAMP    | NO   | NOW()   | 更新日時              |

**インデックス:**
- PRIMARY KEY (id)
- UNIQUE INDEX (email)
- INDEX (department)
- INDEX (role)

### 2. categories - カテゴリ情報

| Column     | Type         | Null | Default | Description        |
|------------|--------------|------|---------|-------------------|
| id         | SERIAL       | NO   |         | カテゴリID (主キー)    |
| name       | VARCHAR(100) | NO   |         | カテゴリ名             |
| type       | VARCHAR(50)  | NO   |         | カテゴリ種別 (business/target/difficulty) |
| description| TEXT         | YES  |         | カテゴリ説明           |
| color      | VARCHAR(7)   | YES  |         | 表示色 (#HEX)         |
| created_at | TIMESTAMP    | NO   | NOW()   | 作成日時              |
| updated_at | TIMESTAMP    | NO   | NOW()   | 更新日時              |

**インデックス:**
- PRIMARY KEY (id)
- INDEX (type)
- UNIQUE INDEX (name, type)

### 3. ai_apps - AIアプリケーション情報

| Column         | Type         | Null | Default     | Description        |
|----------------|--------------|------|-------------|-------------------|
| id             | SERIAL       | NO   |             | アプリID (主キー)     |
| name           | VARCHAR(200) | NO   |             | アプリ名              |
| description    | TEXT         | NO   |             | アプリ説明            |
| category_id    | INTEGER      | NO   |             | カテゴリID (外部キー)  |
| creator_id     | INTEGER      | NO   |             | 作成者ID (外部キー)    |
| status         | VARCHAR(20)  | NO   | 'development' | ステータス          |
| url            | TEXT         | YES  |             | アプリURL            |
| api_endpoint   | TEXT         | YES  |             | API エンドポイント     |
| api_key        | TEXT         | YES  |             | API キー             |
| tech_stack     | JSONB        | YES  |             | 技術スタック情報       |
| usage_guide    | TEXT         | YES  |             | 利用方法             |
| input_example  | TEXT         | YES  |             | 入力例               |
| output_example | TEXT         | YES  |             | 出力例               |
| model_info     | VARCHAR(200) | YES  |             | 使用モデル情報         |
| environment    | TEXT         | YES  |             | 動作環境             |
| usage_count    | INTEGER      | NO   | 0           | 利用回数             |
| avg_rating     | DECIMAL(3,2) | YES  |             | 平均評価             |
| is_public      | BOOLEAN      | NO   | false       | 公開フラグ           |
| created_at     | TIMESTAMP    | NO   | NOW()       | 作成日時             |
| updated_at     | TIMESTAMP    | NO   | NOW()       | 更新日時             |

**インデックス:**
- PRIMARY KEY (id)
- INDEX (category_id)
- INDEX (creator_id)
- INDEX (status)
- INDEX (is_public)
- INDEX (created_at)
- INDEX (avg_rating)
- FULL TEXT INDEX (name, description)

### 4. tags - タグ情報

| Column     | Type         | Null | Default | Description        |
|------------|--------------|------|---------|-------------------|
| id         | SERIAL       | NO   |         | タグID (主キー)       |
| name       | VARCHAR(50)  | NO   |         | タグ名               |
| color      | VARCHAR(7)   | YES  |         | 表示色 (#HEX)        |
| created_at | TIMESTAMP    | NO   | NOW()   | 作成日時             |

**インデックス:**
- PRIMARY KEY (id)
- UNIQUE INDEX (name)

### 5. app_tags - アプリとタグの関連

| Column     | Type      | Null | Default | Description        |
|------------|-----------|------|---------|-------------------|
| app_id     | INTEGER   | NO   |         | アプリID (外部キー)   |
| tag_id     | INTEGER   | NO   |         | タグID (外部キー)     |
| created_at | TIMESTAMP | NO   | NOW()   | 作成日時             |

**インデックス:**
- PRIMARY KEY (app_id, tag_id)
- INDEX (tag_id)

### 6. reviews - レビュー・評価

| Column     | Type         | Null | Default | Description        |
|------------|--------------|------|---------|-------------------|
| id         | SERIAL       | NO   |         | レビューID (主キー)   |
| app_id     | INTEGER      | NO   |         | アプリID (外部キー)   |
| user_id    | INTEGER      | NO   |         | ユーザーID (外部キー) |
| rating     | INTEGER      | NO   |         | 評価 (1-5)          |
| comment    | TEXT         | YES  |         | コメント             |
| created_at | TIMESTAMP    | NO   | NOW()   | 作成日時             |
| updated_at | TIMESTAMP    | NO   | NOW()   | 更新日時             |

**インデックス:**
- PRIMARY KEY (id)
- INDEX (app_id)
- INDEX (user_id)
- UNIQUE INDEX (app_id, user_id)
- INDEX (rating)
- INDEX (created_at)

### 7. favorites - お気に入り

| Column     | Type      | Null | Default | Description        |
|------------|-----------|------|---------|-------------------|
| id         | SERIAL    | NO   |         | お気に入りID (主キー) |
| user_id    | INTEGER   | NO   |         | ユーザーID (外部キー) |
| app_id     | INTEGER   | NO   |         | アプリID (外部キー)   |
| created_at | TIMESTAMP | NO   | NOW()   | 作成日時             |

**インデックス:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (app_id)
- UNIQUE INDEX (user_id, app_id)

### 8. usage_logs - 利用履歴

| Column      | Type         | Null | Default | Description        |
|-------------|--------------|------|---------|-------------------|
| id          | SERIAL       | NO   |         | ログID (主キー)      |
| app_id      | INTEGER      | NO   |         | アプリID (外部キー)   |
| user_id     | INTEGER      | NO   |         | ユーザーID (外部キー) |
| action_type | VARCHAR(50)  | NO   |         | アクション種別 (view/use/download) |
| session_id  | VARCHAR(100) | YES  |         | セッションID         |
| ip_address  | INET         | YES  |         | IPアドレス           |
| user_agent  | TEXT         | YES  |         | ユーザーエージェント   |
| created_at  | TIMESTAMP    | NO   | NOW()   | 作成日時             |

**インデックス:**
- PRIMARY KEY (id)
- INDEX (app_id)
- INDEX (user_id)
- INDEX (action_type)
- INDEX (created_at)
- INDEX (session_id)

### 9. notifications - 通知

| Column     | Type         | Null | Default | Description        |
|------------|--------------|------|---------|-------------------|
| id         | SERIAL       | NO   |         | 通知ID (主キー)      |
| user_id    | INTEGER      | NO   |         | ユーザーID (外部キー) |
| type       | VARCHAR(50)  | NO   |         | 通知種別             |
| title      | VARCHAR(200) | NO   |         | タイトル             |
| message    | TEXT         | NO   |         | メッセージ           |
| related_id | INTEGER      | YES  |         | 関連するID (app_idなど) |
| is_read    | BOOLEAN      | NO   | false   | 既読フラグ           |
| created_at | TIMESTAMP    | NO   | NOW()   | 作成日時             |

**インデックス:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (type)
- INDEX (is_read)
- INDEX (created_at)

## 外部キー制約

```sql
-- ai_apps
ALTER TABLE ai_apps ADD CONSTRAINT fk_ai_apps_category 
    FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE ai_apps ADD CONSTRAINT fk_ai_apps_creator 
    FOREIGN KEY (creator_id) REFERENCES users(id);

-- app_tags
ALTER TABLE app_tags ADD CONSTRAINT fk_app_tags_app 
    FOREIGN KEY (app_id) REFERENCES ai_apps(id) ON DELETE CASCADE;
ALTER TABLE app_tags ADD CONSTRAINT fk_app_tags_tag 
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;

-- reviews
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_app 
    FOREIGN KEY (app_id) REFERENCES ai_apps(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user 
    FOREIGN KEY (user_id) REFERENCES users(id);

-- favorites
ALTER TABLE favorites ADD CONSTRAINT fk_favorites_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE favorites ADD CONSTRAINT fk_favorites_app 
    FOREIGN KEY (app_id) REFERENCES ai_apps(id) ON DELETE CASCADE;

-- usage_logs
ALTER TABLE usage_logs ADD CONSTRAINT fk_usage_logs_app 
    FOREIGN KEY (app_id) REFERENCES ai_apps(id);
ALTER TABLE usage_logs ADD CONSTRAINT fk_usage_logs_user 
    FOREIGN KEY (user_id) REFERENCES users(id);

-- notifications
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

## 列挙値定義

### user.role
- `'user'` - 一般ユーザー
- `'admin'` - アプリ管理者
- `'super_admin'` - システム管理者

### ai_apps.status
- `'development'` - 開発中
- `'testing'` - テスト中  
- `'active'` - 本稼働
- `'maintenance'` - メンテナンス中
- `'deprecated'` - 廃止予定
- `'archived'` - 廃止済み

### categories.type
- `'business'` - 業務カテゴリ
- `'target'` - 利用対象カテゴリ
- `'difficulty'` - 難易度カテゴリ

### usage_logs.action_type
- `'view'` - 詳細表示
- `'use'` - 利用開始
- `'download'` - ダウンロード

### notifications.type
- `'new_app'` - 新着アプリ通知
- `'app_update'` - アプリ更新通知
- `'maintenance'` - メンテナンス通知
- `'recommendation'` - おすすめ通知