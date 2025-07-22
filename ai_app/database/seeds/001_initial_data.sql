-- Seed file: 001_initial_data.sql
-- Description: Initial data for AI App Catalog
-- Author: AI App Catalog Development Team
-- Date: 2025-01-22

-- Insert initial categories
INSERT INTO categories (name, type, description, color) VALUES
-- Business categories
('文書作成・編集', 'business', 'レポート、提案書、メール等の文書作成支援', '#3B82F6'),
('データ分析・レポート', 'business', 'データ解析、可視化、レポート生成', '#10B981'),
('翻訳・多言語対応', 'business', '文書翻訳、多言語コンテンツ作成', '#F59E0B'),
('コード生成・開発支援', 'business', 'プログラミング、コードレビュー、開発支援', '#8B5CF6'),
('画像・動画処理', 'business', '画像編集、動画作成、メディア処理', '#EF4444'),
('顧客対応・チャットボット', 'business', 'カスタマーサポート、FAQ、チャット対応', '#06B6D4'),
('その他', 'business', 'その他の業務支援ツール', '#6B7280'),

-- Target categories
('全社員', 'target', 'すべての社員が利用可能', '#059669'),
('特定部署', 'target', '特定の部署のみ利用可能', '#0891B2'),
('管理職のみ', 'target', '管理職・役職者のみ利用可能', '#C2410C'),
('開発者向け', 'target', 'エンジニア・開発者向け', '#7C3AED'),

-- Difficulty categories
('初心者向け', 'difficulty', '簡単に使えるツール', '#22C55E'),
('中級者向け', 'difficulty', '一定の知識が必要なツール', '#F59E0B'),
('上級者向け', 'difficulty', '専門知識が必要なツール', '#EF4444');

-- Insert initial users (system users)
INSERT INTO users (email, name, department, role) VALUES
('admin@company.com', 'システム管理者', 'IT部', 'super_admin'),
('ai-team@company.com', 'AI開発チーム', 'IT部', 'admin'),
('demo-user@company.com', 'デモユーザー', '営業部', 'user');

-- Insert initial tags
INSERT INTO tags (name, color) VALUES
('おすすめ', '#FF6B6B'),
('新着', '#4ECDC4'),
('人気', '#45B7D1'),
('GPT', '#96CEB4'),
('Claude', '#FFEAA7'),
('無料', '#DDA0DD'),
('有料', '#98D8C8'),
('API', '#F7DC6F'),
('ノーコード', '#BB8FCE'),
('実験的', '#85C1E9'),
('安定版', '#82E0AA'),
('メンテナンス中', '#F8C471');

-- Insert sample AI applications
INSERT INTO ai_apps (
    name, 
    description, 
    category_id, 
    creator_id, 
    status, 
    url,
    usage_guide,
    input_example,
    output_example,
    model_info,
    tech_stack,
    is_public
) VALUES
(
    '議事録自動生成ツール',
    '会議の音声を自動的に文字起こしし、議事録を生成するツールです。重要なポイントを自動抽出し、整理された議事録を作成できます。',
    1, -- 文書作成・編集
    2, -- AI開発チーム
    'active',
    'https://meeting-minutes.company.com',
    '1. 音声ファイルをアップロード\n2. 処理開始ボタンをクリック\n3. 生成された議事録を確認・編集\n4. 必要に応じてPDF形式でダウンロード',
    '会議の音声ファイル（MP3, WAV形式）',
    '整理された議事録（マークダウン形式）\n・参加者一覧\n・議題と結論\n・アクションアイテム',
    'Whisper API + GPT-4',
    '{"frontend": ["React", "TypeScript"], "backend": ["Node.js", "Express"], "ai": ["OpenAI Whisper", "GPT-4"]}',
    true
),
(
    'データ可視化アシスタント',
    'CSVファイルやExcelデータを読み込み、適切なグラフや図表を自動生成します。データの傾向分析も行います。',
    2, -- データ分析・レポート
    2, -- AI開発チーム
    'active',
    'https://data-viz.company.com',
    '1. データファイルをアップロード\n2. 分析したい項目を選択\n3. グラフタイプを選択（または自動選択）\n4. 生成されたグラフを確認・カスタマイズ',
    'CSV、Excel形式のデータファイル',
    'インタラクティブなグラフ・チャート\n分析結果のサマリー',
    'GPT-4 + Python (matplotlib, plotly)',
    '{"frontend": ["Vue.js", "D3.js"], "backend": ["Python", "FastAPI"], "ai": ["GPT-4"]}',
    true
),
(
    '多言語文書翻訳システム',
    '技術文書やビジネス文書を高精度で翻訳します。文脈を理解した自然な翻訳を提供し、専門用語辞書にも対応しています。',
    3, -- 翻訳・多言語対応
    2, -- AI開発チーム
    'active',
    'https://translate.company.com',
    '1. 翻訳したい文書をアップロード\n2. 翻訳元・翻訳先言語を選択\n3. 専門分野を指定（オプション）\n4. 翻訳結果をダウンロード',
    '日本語、英語、中国語、韓国語の文書',
    '自然で正確な翻訳文書\n専門用語の対訳表',
    'GPT-4 + カスタム辞書',
    '{"frontend": ["Next.js", "React"], "backend": ["Node.js", "Express"], "ai": ["GPT-4"]}',
    true
),
(
    'コードレビューAI',
    'プルリクエストのコードを自動レビューし、品質向上のための提案を行います。セキュリティ脆弱性の検出も可能です。',
    4, -- コード生成・開発支援
    2, -- AI開発チーム
    'testing',
    'https://code-review.company.com',
    '1. GitHubリポジトリを連携\n2. レビューしたいプルリクエストを選択\n3. AIレビュー実行\n4. 提案内容を確認・適用',
    'GitHub プルリクエストのURL',
    'コード品質の評価\n改善提案\nセキュリティ指摘事項',
    'GPT-4 + CodeQL',
    '{"frontend": ["React", "TypeScript"], "backend": ["Python", "Django"], "ai": ["GPT-4", "GitHub Copilot"]}',
    false
),
(
    '画像背景除去ツール',
    'アップロードした画像から自動的に背景を除去し、透明背景のPNG画像を生成します。商品画像の作成に最適です。',
    5, -- 画像・動画処理
    2, -- AI開発チーム
    'active',
    'https://bg-remover.company.com',
    '1. 画像ファイルをアップロード\n2. 処理開始\n3. 結果確認\n4. PNG形式でダウンロード',
    'JPG、PNG形式の画像ファイル',
    '背景が除去された透明PNG画像',
    'U2-Net + REMBG',
    '{"frontend": ["Vue.js"], "backend": ["Python", "FastAPI"], "ai": ["U2-Net"]}',
    true
),
(
    'FAQ自動応答システム',
    '顧客からの問い合わせに自動的に回答します。社内ナレッジベースを学習し、適切な回答を生成します。',
    6, -- 顧客対応・チャットボット
    2, -- AI開発チーム
    'development',
    null,
    '管理画面から質問・回答セットを登録し、チャットボットとして導入',
    '顧客からの問い合わせテキスト',
    '適切な回答文章\n関連するFAQリンク',
    'GPT-3.5 + RAG',
    '{"frontend": ["React", "Socket.io"], "backend": ["Node.js", "Express"], "ai": ["GPT-3.5", "Embedding"]}',
    false
);

-- Insert app-tag relationships
INSERT INTO app_tags (app_id, tag_id) VALUES
-- 議事録自動生成ツール
(1, 1), -- おすすめ
(1, 3), -- 人気
(1, 4), -- GPT
(1, 11), -- 安定版

-- データ可視化アシスタント
(2, 1), -- おすすめ
(2, 4), -- GPT
(2, 11), -- 安定版

-- 多言語文書翻訳システム
(3, 3), -- 人気
(3, 4), -- GPT
(3, 11), -- 安定版

-- コードレビューAI
(4, 2), -- 新着
(4, 4), -- GPT
(4, 10), -- 実験的

-- 画像背景除去ツール
(5, 1), -- おすすめ
(5, 6), -- 無料
(5, 11), -- 安定版

-- FAQ自動応答システム
(6, 2), -- 新着
(6, 4), -- GPT
(6, 10); -- 実験的

-- Insert sample reviews
INSERT INTO reviews (app_id, user_id, rating, comment) VALUES
(1, 3, 5, '議事録の作成が大幅に効率化されました。音声認識の精度も高く、手作業での修正がほとんど不要です。'),
(2, 3, 4, 'データの可視化が簡単にできて便利です。もう少しグラフの種類が増えると嬉しいです。'),
(3, 3, 5, '翻訳の品質が非常に高く、技術文書でも自然な翻訳になります。業務効率が大幅に改善されました。'),
(5, 3, 4, '背景除去の精度は良いですが、細かい髪の毛などの処理で時々不自然になることがあります。');

-- Insert sample favorites
INSERT INTO favorites (user_id, app_id) VALUES
(3, 1), -- デモユーザーが議事録ツールをお気に入り
(3, 3), -- デモユーザーが翻訳システムをお気に入り
(3, 5); -- デモユーザーが背景除去ツールをお気に入り

-- Insert sample usage logs
INSERT INTO usage_logs (app_id, user_id, action_type, session_id, ip_address) VALUES
(1, 3, 'view', 'sess_001', '192.168.1.100'),
(1, 3, 'use', 'sess_001', '192.168.1.100'),
(2, 3, 'view', 'sess_002', '192.168.1.100'),
(3, 3, 'view', 'sess_003', '192.168.1.100'),
(3, 3, 'use', 'sess_003', '192.168.1.100'),
(5, 3, 'view', 'sess_004', '192.168.1.100'),
(5, 3, 'use', 'sess_004', '192.168.1.100');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, related_id) VALUES
(3, 'new_app', '新しいAIアプリが追加されました', 'FAQ自動応答システムが開発中として追加されました。', 6),
(3, 'app_update', 'お気に入りアプリが更新されました', '議事録自動生成ツールに新機能が追加されました。', 1),
(3, 'recommendation', 'おすすめのアプリがあります', 'データ可視化アシスタントがあなたの業務に役立つかもしれません。', 2);

-- Update sequences to current max values (in case of manual insertions)
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('ai_apps_id_seq', (SELECT MAX(id) FROM ai_apps));
SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags));
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));
SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));
SELECT setval('usage_logs_id_seq', (SELECT MAX(id) FROM usage_logs));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));