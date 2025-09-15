# 🚀 プロジェクト設定テンプレート

## 適用する設定

### 1. ヘルプ・マニュアル
- [ ] manual.html 作成
- [ ] faq.html 作成
- [ ] トップページにマニュアルリンク追加

### 2. Adobe風UIデザイン
- [ ] ヘッダー：`bg-gradient-to-r from-gray-50 to-white` + `shadow-lg`
- [ ] ツールバー：`bg-gradient-to-r from-gray-50 to-white` + 影効果
- [ ] メインエリア：`bg-gradient-to-br from-gray-50 to-gray-100` + `rounded-xl shadow-lg`
- [ ] ボタン：`hover:shadow-md` + グラデーション背景
- [ ] フォントサイズ：14px（基本）、16px（ヘッダー）、12px（小）
- [ ] 角丸：`rounded-lg`（ボタン）、`rounded-xl`（カード）
- [ ] 影：`shadow-sm`（軽い）、`shadow-md`（中）、`shadow-lg`（強）

### 3. ローカルサーバー設定
- [ ] .vscode/tasks.json
- [ ] .vscode/launch.json
- [ ] .vscode/settings.json
- [ ] start-dev.sh
- [ ] package.jsonスクリプト追加

### 4. SEO最適化
- [ ] メタタグ設定
- [ ] Open Graph設定
- [ ] Twitter Cards設定
- [ ] JSON-LD構造化データ
- [ ] sitemap.xml更新
- [ ] robots.txt更新

### 5. 開発環境
- [ ] ポート3000で起動
- [ ] ポート競合処理
- [ ] 自動リロード
- [ ] エラーハンドリング

## 使用方法

1. 新しいプロジェクトでこのテンプレートを使用
2. 各項目をチェックして適用
3. プロジェクト固有の設定を追加
4. テストして動作確認

## 注意事項

- 既存のプロジェクト設定を上書きしないよう注意
- プロジェクト固有の設定は保持
- 設定適用前にバックアップを取る
