# ランキング機能 データベース設計

## ランキング機能の要件

1. **評価によるランキング**: レビューの平均評価でのランキング表示
2. **アクセス回数によるランキング**: 利用回数でのランキング表示  
3. **複合ランキング**: 評価と利用回数を組み合わせたスコアによるランキング

## 既存テーブルの活用

### ai_apps テーブル
```sql
-- 既存の列を活用
usage_count    INTEGER      -- 利用回数（usage_logsから集計）
avg_rating     DECIMAL(3,2) -- 平均評価（reviewsから集計）
```

### 新規追加列（推奨）
```sql
-- ランキング用の追加列
ALTER TABLE ai_apps 
ADD COLUMN ranking_score DECIMAL(5,2) DEFAULT 0,  -- 複合スコア
ADD COLUMN monthly_usage INTEGER DEFAULT 0,       -- 月間利用回数
ADD COLUMN weekly_usage INTEGER DEFAULT 0;        -- 週間利用回数
```

## ランキング算出方法

### 1. 評価ランキング
```sql
-- 平均評価順（レビュー数も考慮）
SELECT 
  id, name, avg_rating,
  (SELECT COUNT(*) FROM reviews WHERE app_id = ai_apps.id) as review_count
FROM ai_apps 
WHERE avg_rating IS NOT NULL 
  AND (SELECT COUNT(*) FROM reviews WHERE app_id = ai_apps.id) >= 3
ORDER BY avg_rating DESC, review_count DESC;
```

### 2. アクセスランキング  
```sql
-- 利用回数順
SELECT id, name, usage_count
FROM ai_apps 
WHERE usage_count > 0
ORDER BY usage_count DESC;
```

### 3. 複合ランキング算出式
```
ranking_score = (avg_rating * 0.4) + (normalized_usage_count * 0.6)

normalized_usage_count = (usage_count / max_usage_count) * 5.0
```

## バッチ処理での集計更新

### 1. 平均評価の更新
```sql
UPDATE ai_apps 
SET avg_rating = (
  SELECT AVG(rating::DECIMAL)
  FROM reviews 
  WHERE app_id = ai_apps.id
)
WHERE id IN (
  SELECT DISTINCT app_id FROM reviews
);
```

### 2. 利用回数の更新
```sql  
UPDATE ai_apps
SET usage_count = (
  SELECT COUNT(*)
  FROM usage_logs 
  WHERE app_id = ai_apps.id
),
monthly_usage = (
  SELECT COUNT(*)
  FROM usage_logs 
  WHERE app_id = ai_apps.id 
    AND created_at >= NOW() - INTERVAL '1 month'
),
weekly_usage = (
  SELECT COUNT(*)
  FROM usage_logs 
  WHERE app_id = ai_apps.id 
    AND created_at >= NOW() - INTERVAL '1 week'
);
```

### 3. 複合スコアの更新
```sql
UPDATE ai_apps 
SET ranking_score = (
  COALESCE(avg_rating, 0) * 0.4 + 
  (usage_count::DECIMAL / GREATEST((SELECT MAX(usage_count) FROM ai_apps), 1)) * 5.0 * 0.6
)
WHERE usage_count > 0 OR avg_rating IS NOT NULL;
```

## ランキング用ビュー

### 評価ランキングビュー
```sql
CREATE VIEW ranking_by_rating AS
SELECT 
  id, name, description, avg_rating,
  (SELECT COUNT(*) FROM reviews WHERE app_id = ai_apps.id) as review_count,
  ROW_NUMBER() OVER (ORDER BY avg_rating DESC, review_count DESC) as rank
FROM ai_apps 
WHERE avg_rating IS NOT NULL 
  AND (SELECT COUNT(*) FROM reviews WHERE app_id = ai_apps.id) >= 1
ORDER BY rank;
```

### アクセスランキングビュー  
```sql
CREATE VIEW ranking_by_usage AS
SELECT 
  id, name, description, usage_count,
  ROW_NUMBER() OVER (ORDER BY usage_count DESC) as rank
FROM ai_apps 
WHERE usage_count > 0
ORDER BY rank;
```

### 複合ランキングビュー
```sql
CREATE VIEW ranking_combined AS
SELECT 
  id, name, description, avg_rating, usage_count, ranking_score,
  ROW_NUMBER() OVER (ORDER BY ranking_score DESC) as rank
FROM ai_apps 
WHERE ranking_score > 0
ORDER BY rank;
```

## API エンドポイント設計

### ランキングAPI
- `GET /api/ranking/rating` - 評価ランキング
- `GET /api/ranking/usage` - アクセスランキング  
- `GET /api/ranking/combined` - 複合ランキング

### クエリパラメータ
- `limit`: 取得件数（デフォルト: 10、最大: 50）
- `period`: 期間指定（all/monthly/weekly）

## 実装のポイント

1. **パフォーマンス**: ビューを使用してクエリを最適化
2. **リアルタイム性**: バッチ処理で定期的に集計データを更新
3. **スケーラビリティ**: インデックスを適切に設定
4. **認証不要**: 匿名ユーザーでもランキング閲覧可能