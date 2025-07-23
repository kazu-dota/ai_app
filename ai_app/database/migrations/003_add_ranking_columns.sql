-- ランキング機能用のカラム追加
-- Migration: 003_add_ranking_columns

-- ai_appsテーブルにランキング用カラムを追加
ALTER TABLE ai_apps 
ADD COLUMN IF NOT EXISTS ranking_score DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_usage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS weekly_usage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_ranking_update TIMESTAMP DEFAULT NOW();

-- インデックスの追加
CREATE INDEX IF NOT EXISTS idx_ai_apps_ranking_score ON ai_apps(ranking_score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_apps_monthly_usage ON ai_apps(monthly_usage DESC);
CREATE INDEX IF NOT EXISTS idx_ai_apps_weekly_usage ON ai_apps(weekly_usage DESC);
CREATE INDEX IF NOT EXISTS idx_ai_apps_avg_rating ON ai_apps(avg_rating DESC);
CREATE INDEX IF NOT EXISTS idx_ai_apps_usage_count ON ai_apps(usage_count DESC);

-- 評価ランキングビューの作成
CREATE OR REPLACE VIEW ranking_by_rating AS
SELECT 
  id, name, description, avg_rating, usage_count,
  (SELECT COUNT(*) FROM reviews WHERE app_id = ai_apps.id) as review_count,
  ROW_NUMBER() OVER (ORDER BY avg_rating DESC NULLS LAST, review_count DESC) as rank
FROM ai_apps 
WHERE is_public = true
  AND status = 'active'
  AND avg_rating IS NOT NULL 
ORDER BY rank;

-- アクセスランキングビューの作成
CREATE OR REPLACE VIEW ranking_by_usage AS
SELECT 
  id, name, description, usage_count, avg_rating,
  ROW_NUMBER() OVER (ORDER BY usage_count DESC) as rank
FROM ai_apps 
WHERE is_public = true
  AND status = 'active'
  AND usage_count > 0
ORDER BY rank;

-- 複合ランキングビューの作成
CREATE OR REPLACE VIEW ranking_combined AS
SELECT 
  id, name, description, avg_rating, usage_count, ranking_score,
  ROW_NUMBER() OVER (ORDER BY ranking_score DESC) as rank
FROM ai_apps 
WHERE is_public = true
  AND status = 'active'
  AND ranking_score > 0
ORDER BY rank;

-- 月間ランキングビューの作成
CREATE OR REPLACE VIEW ranking_monthly AS
SELECT 
  id, name, description, monthly_usage, avg_rating,
  ROW_NUMBER() OVER (ORDER BY monthly_usage DESC) as rank
FROM ai_apps 
WHERE is_public = true
  AND status = 'active'
  AND monthly_usage > 0
ORDER BY rank;

-- 週間ランキングビューの作成
CREATE OR REPLACE VIEW ranking_weekly AS
SELECT 
  id, name, description, weekly_usage, avg_rating,
  ROW_NUMBER() OVER (ORDER BY weekly_usage DESC) as rank
FROM ai_apps 
WHERE is_public = true
  AND status = 'active'
  AND weekly_usage > 0
ORDER BY rank;

-- ランキング更新用ファンクションの作成
CREATE OR REPLACE FUNCTION update_app_rankings() 
RETURNS void AS $$
BEGIN
  -- 平均評価を更新
  UPDATE ai_apps 
  SET avg_rating = subquery.avg_rating
  FROM (
    SELECT app_id, AVG(rating::DECIMAL) as avg_rating
    FROM reviews 
    GROUP BY app_id
  ) AS subquery
  WHERE ai_apps.id = subquery.app_id;

  -- 利用回数統計を更新
  UPDATE ai_apps 
  SET 
    usage_count = COALESCE(all_time.usage_count, 0),
    monthly_usage = COALESCE(monthly.usage_count, 0),  
    weekly_usage = COALESCE(weekly.usage_count, 0)
  FROM 
  (
    SELECT app_id, COUNT(*) as usage_count
    FROM usage_logs 
    GROUP BY app_id
  ) AS all_time
  FULL OUTER JOIN
  (
    SELECT app_id, COUNT(*) as usage_count
    FROM usage_logs 
    WHERE created_at >= NOW() - INTERVAL '1 month'
    GROUP BY app_id
  ) AS monthly ON all_time.app_id = monthly.app_id
  FULL OUTER JOIN
  (
    SELECT app_id, COUNT(*) as usage_count
    FROM usage_logs 
    WHERE created_at >= NOW() - INTERVAL '1 week'
    GROUP BY app_id
  ) AS weekly ON COALESCE(all_time.app_id, monthly.app_id) = weekly.app_id
  WHERE ai_apps.id = COALESCE(all_time.app_id, monthly.app_id, weekly.app_id);

  -- 複合スコアを更新
  UPDATE ai_apps 
  SET ranking_score = (
    COALESCE(avg_rating, 0) * 0.4 + 
    (usage_count::DECIMAL / GREATEST((SELECT MAX(usage_count) FROM ai_apps WHERE usage_count > 0), 1)) * 5.0 * 0.6
  ),
  last_ranking_update = NOW()
  WHERE usage_count > 0 OR avg_rating IS NOT NULL;
  
END;
$$ LANGUAGE plpgsql;

-- 初回データ更新を実行
SELECT update_app_rankings();