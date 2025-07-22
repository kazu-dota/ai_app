# Contributing to AI App Catalog

AI App Catalogプロジェクトへのコントリビューションを歓迎します！このガイドでは、プロジェクトに貢献する方法について説明します。

## 🎯 貢献の方法

以下の方法でプロジェクトに貢献できます：

- 🐛 バグの報告
- 💡 新機能の提案
- 📝 ドキュメントの改善
- 🔧 コードの修正・改善
- 🧪 テストの追加・改善
- 🌐 翻訳の追加・改善

## 🚀 開発環境のセットアップ

### 必要要件

- Node.js 18.x以上
- PostgreSQL 14.x以上
- Docker & Docker Compose
- Git

### セットアップ手順

1. リポジトリをフォーク
2. ローカルにクローン
```bash
git clone https://github.com/YOUR_USERNAME/ai_app.git
cd ai_app
```

3. 依存関係のインストール
```bash
npm install
```

4. 環境変数の設定
```bash
cp .env.example .env
```

5. 開発サーバーの起動
```bash
npm run dev
```

## 📝 Issue報告

バグを発見した場合や新機能を提案したい場合は、まずIssueを作成してください。

### バグ報告

以下の情報を含めてください：

- バグの詳細な説明
- 再現手順
- 期待する動作
- 実際の動作
- 環境情報（OS、ブラウザ、Node.jsのバージョンなど）
- スクリーンショット（必要に応じて）

### 機能要求

以下の情報を含めてください：

- 機能の詳細な説明
- 使用事例
- 期待する動作
- 実装のアイデア（あれば）

## 🔧 プルリクエストのガイドライン

### 開発フロー

1. **Issue確認**: 作業前に関連するIssueを確認、または作成
2. **ブランチ作成**: `main`から新しいブランチを作成
   ```bash
   git checkout -b feature/your-feature-name
   # または
   git checkout -b fix/your-bug-fix
   ```
3. **コード作成**: 変更を実装
4. **テスト**: すべてのテストが通ることを確認
5. **コミット**: 意味のあるコミットメッセージで変更をコミット
6. **プッシュ**: フォークしたリポジトリにプッシュ
7. **PR作成**: プルリクエストを作成

### ブランチ命名規則

- `feature/機能名` - 新機能の追加
- `fix/バグ修正内容` - バグ修正
- `docs/ドキュメント更新内容` - ドキュメント更新
- `refactor/リファクタリング内容` - コードリファクタリング
- `test/テスト内容` - テスト追加・修正

### コミットメッセージ規則

[Conventional Commits](https://www.conventionalcommits.org/)に従ってください：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Type

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードスタイルの変更（機能に影響しない）
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: その他のメンテナンス

#### 例

```
feat(auth): add OAuth login functionality

Add support for Google OAuth authentication
- Add OAuth configuration
- Implement login/logout flow
- Add user profile display

Closes #123
```

### プルリクエストのチェックリスト

- [ ] コードが動作することを確認
- [ ] すべてのテストが通ることを確認
- [ ] リンター・フォーマッターが通ることを確認
- [ ] 適切なコミットメッセージ
- [ ] 関連するIssueをクローズ
- [ ] ドキュメントの更新（必要に応じて）
- [ ] 破壊的変更がある場合は明記

## 🧪 テスト

コードを変更する場合は、適切なテストを追加・更新してください。

```bash
# 全テスト実行
npm run test

# 特定のテストファイル実行
npm run test -- path/to/test.spec.js

# カバレッジ付きでテスト実行
npm run test:coverage
```

## 📏 コードスタイル

プロジェクトでは以下のツールを使用してコードスタイルを統一しています：

- **ESLint**: JavaScript/TypeScriptのリンター
- **Prettier**: コードフォーマッター
- **Husky**: Git hooksの管理

### 実行コマンド

```bash
# リンター実行
npm run lint

# フォーマッター実行
npm run format

# 自動修正
npm run lint:fix
```

## 📚 ドキュメント

ドキュメントの改善も大歓迎です：

- README.mdの改善
- API仕様書の更新
- コメントの追加・改善
- チュートリアルの作成

## 🌐 国際化（i18n）

多言語対応の改善にも貢献できます：

- 新しい言語の翻訳追加
- 既存翻訳の改善
- 国際化対応のバグ修正

## 🚦 レビュープロセス

プルリクエストは以下のプロセスでレビューされます：

1. **自動チェック**: CI/CDでテスト・リンターが実行
2. **コードレビュー**: メンテナーによるレビュー
3. **修正対応**: 必要に応じて修正
4. **マージ**: 承認後にmainブランチにマージ

## 📞 質問・サポート

質問がある場合は、以下の方法でお気軽にお問い合わせください：

- 🐛 [GitHub Issues](https://github.com/kazu-dota/ai_app/issues) - バグ報告・機能要求
- 💬 [GitHub Discussions](https://github.com/kazu-dota/ai_app/discussions) - 質問・議論
- 📧 [メール](mailto:support@example.com) - その他のお問い合わせ

## 🙏 謝辞

コントリビューションに時間を割いていただき、ありがとうございます！
あなたの貢献により、AI App Catalogはより良いプロダクトになります。

---

Happy Coding! 🚀