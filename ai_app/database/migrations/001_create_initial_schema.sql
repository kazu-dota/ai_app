-- Migration: 001_create_initial_schema.sql
-- Description: Create initial database schema for AI App Catalog
-- Author: AI App Catalog Development Team
-- Date: 2025-01-22

-- Enable UUID extension if needed in future
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for users table
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_role ON users(role);

-- 2. Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('business', 'target', 'difficulty')),
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(name, type)
);

-- Create indexes for categories table
CREATE INDEX idx_categories_type ON categories(type);

-- 3. Create ai_apps table
CREATE TABLE ai_apps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    creator_id INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'development' CHECK (
        status IN ('development', 'testing', 'active', 'maintenance', 'deprecated', 'archived')
    ),
    url TEXT,
    api_endpoint TEXT,
    api_key TEXT,
    tech_stack JSONB,
    usage_guide TEXT,
    input_example TEXT,
    output_example TEXT,
    model_info VARCHAR(200),
    environment TEXT,
    usage_count INTEGER NOT NULL DEFAULT 0,
    avg_rating DECIMAL(3,2) CHECK (avg_rating >= 1.0 AND avg_rating <= 5.0),
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for ai_apps table
CREATE INDEX idx_ai_apps_category_id ON ai_apps(category_id);
CREATE INDEX idx_ai_apps_creator_id ON ai_apps(creator_id);
CREATE INDEX idx_ai_apps_status ON ai_apps(status);
CREATE INDEX idx_ai_apps_is_public ON ai_apps(is_public);
CREATE INDEX idx_ai_apps_created_at ON ai_apps(created_at);
CREATE INDEX idx_ai_apps_avg_rating ON ai_apps(avg_rating);
CREATE INDEX idx_ai_apps_usage_count ON ai_apps(usage_count);

-- Create full-text search index for ai_apps
CREATE INDEX idx_ai_apps_search ON ai_apps USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- 4. Create tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Create app_tags junction table
CREATE TABLE app_tags (
    app_id INTEGER NOT NULL REFERENCES ai_apps(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (app_id, tag_id)
);

-- Create indexes for app_tags table
CREATE INDEX idx_app_tags_tag_id ON app_tags(tag_id);

-- 6. Create reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    app_id INTEGER NOT NULL REFERENCES ai_apps(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(app_id, user_id)
);

-- Create indexes for reviews table
CREATE INDEX idx_reviews_app_id ON reviews(app_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- 7. Create favorites table
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    app_id INTEGER NOT NULL REFERENCES ai_apps(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, app_id)
);

-- Create indexes for favorites table
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_app_id ON favorites(app_id);

-- 8. Create usage_logs table
CREATE TABLE usage_logs (
    id SERIAL PRIMARY KEY,
    app_id INTEGER NOT NULL REFERENCES ai_apps(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('view', 'use', 'download')),
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for usage_logs table
CREATE INDEX idx_usage_logs_app_id ON usage_logs(app_id);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_action_type ON usage_logs(action_type);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX idx_usage_logs_session_id ON usage_logs(session_id) WHERE session_id IS NOT NULL;

-- 9. Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('new_app', 'app_update', 'maintenance', 'recommendation')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_id INTEGER,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for notifications table
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Create triggers for updating updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_apps_updated_at BEFORE UPDATE ON ai_apps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update avg_rating when reviews are changed
CREATE OR REPLACE FUNCTION update_app_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ai_apps 
    SET avg_rating = (
        SELECT ROUND(AVG(rating)::numeric, 2)
        FROM reviews 
        WHERE app_id = COALESCE(NEW.app_id, OLD.app_id)
    )
    WHERE id = COALESCE(NEW.app_id, OLD.app_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply trigger to update avg_rating when reviews change
CREATE TRIGGER update_app_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_app_rating();

-- Create function to increment usage_count when usage_logs are added
CREATE OR REPLACE FUNCTION increment_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.action_type = 'use' THEN
        UPDATE ai_apps 
        SET usage_count = usage_count + 1
        WHERE id = NEW.app_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to increment usage_count
CREATE TRIGGER increment_usage_count_trigger 
    AFTER INSERT ON usage_logs
    FOR EACH ROW EXECUTE FUNCTION increment_usage_count();

-- Add comments for documentation
COMMENT ON TABLE users IS 'ユーザー情報を管理するテーブル';
COMMENT ON TABLE categories IS 'アプリのカテゴリ情報を管理するテーブル';
COMMENT ON TABLE ai_apps IS 'AIアプリケーションの情報を管理するテーブル';
COMMENT ON TABLE tags IS 'アプリに付与するタグ情報を管理するテーブル';
COMMENT ON TABLE app_tags IS 'アプリとタグの関連付けを管理するテーブル';
COMMENT ON TABLE reviews IS 'アプリのレビュー・評価を管理するテーブル';
COMMENT ON TABLE favorites IS 'ユーザーのお気に入りアプリを管理するテーブル';
COMMENT ON TABLE usage_logs IS 'アプリの利用履歴を管理するテーブル';
COMMENT ON TABLE notifications IS 'ユーザーへの通知を管理するテーブル';

COMMENT ON COLUMN ai_apps.tech_stack IS 'JSON形式で技術スタック情報を格納 {"frontend": ["React", "TypeScript"], "backend": ["Node.js", "Express"]}';
COMMENT ON COLUMN ai_apps.avg_rating IS '平均評価 (1.00-5.00)';
COMMENT ON COLUMN reviews.rating IS '1-5段階評価';
COMMENT ON COLUMN usage_logs.action_type IS 'view: 詳細表示, use: 利用開始, download: ダウンロード';
COMMENT ON COLUMN notifications.type IS 'new_app: 新着アプリ, app_update: 更新, maintenance: メンテナンス, recommendation: おすすめ';