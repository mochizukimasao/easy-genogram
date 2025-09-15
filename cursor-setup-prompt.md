# 🚀 Cursor設定引き継ぎプロンプト

## 新しいプロジェクトに適用する設定

以下の設定を新しいプロジェクトに適用してください：

### 1. ヘルプ・マニュアル作成
- 操作マニュアル（manual.html）を作成
- FAQページ（faq.html）を作成
- トップページからマニュアルへのリンクを追加
- 詳細な使い方説明とキーボードショートカットを含める

### 2. Adobe風UIデザイン統一
- ヘッダー：`bg-gradient-to-r from-gray-50 to-white` + `shadow-lg`
- ツールバー：`bg-gradient-to-r from-gray-50 to-white` + 影効果
- メインエリア：`bg-gradient-to-br from-gray-50 to-gray-100` + `rounded-xl shadow-lg`
- ボタン：`hover:shadow-md` + グラデーション背景
- フォントサイズ：14px（基本）、16px（ヘッダー）、12px（小）
- 角丸：`rounded-lg`（ボタン）、`rounded-xl`（カード）
- 影：`shadow-sm`（軽い）、`shadow-md`（中）、`shadow-lg`（強）

### 3. ローカルサーバー自動起動設定
- .vscode/tasks.json（タスク定義）
- .vscode/launch.json（デバッグ設定）
- .vscode/settings.json（エディタ設定）
- start-dev.sh（自動起動スクリプト）
- package.jsonに便利なスクリプト追加

### 4. SEO最適化
- メタタグ（title, description, keywords）
- Open Graph（og:title, og:description, og:image）
- Twitter Cards
- JSON-LD構造化データ
- sitemap.xml更新
- robots.txt更新

### 5. 開発環境設定
- ポート3000で起動
- ポート競合時の自動処理
- ファイル変更時の自動リロード
- エラーハンドリング

### 6. ファイル構成
- .vscode/（Cursor/VS Code設定）
- public/（静的ファイル）
- スクリプトファイル（.sh）
- 設定ファイル（.json）

## 適用手順

1. プロジェクトを開く
2. このプロンプトをAIに送信
3. 設定を順次適用
4. 動作確認
5. プロジェクト固有の設定を追加

## 注意事項

- 既存の設定を上書きしないよう注意
- プロジェクト固有の設定は保持
- 設定適用前にバックアップを取る
