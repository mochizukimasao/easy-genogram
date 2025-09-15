# 🚀 開発環境セットアップ

## クイックスタート

### 1. プロジェクトを開く
```bash
# プロジェクトディレクトリに移動
cd easy-genogram

# 依存関係をインストール（初回のみ）
npm install
```

### 2. 開発サーバーを起動

#### 方法A: 自動起動スクリプト（推奨）
```bash
npm start
# または
./start-dev.sh
```

#### 方法B: 直接起動
```bash
npm run dev
```

#### 方法C: ブラウザで自動開く
```bash
npm run dev:open
```

#### 方法D: 強制再起動（ポート競合時）
```bash
npm run dev:force
```

### 3. アクセス
- **URL**: http://localhost:3000
- **自動リロード**: ファイル変更時に自動更新

## Cursor/VS Codeでの開発

### タスクの実行
1. `Cmd+Shift+P` (Mac) または `Ctrl+Shift+P` (Windows/Linux)
2. "Tasks: Run Task" を選択
3. 以下のタスクから選択：
   - 🚀 Start Dev Server
   - 🛑 Stop Dev Server
   - 🌐 Open in Browser
   - 📦 Build Project
   - 🚀 Deploy to Vercel

### デバッグ
1. `F5` キーを押す
2. "🚀 Launch Dev Server" を選択

## 便利なコマンド

```bash
# 開発サーバー起動
npm run dev

# ブラウザで自動開く
npm run dev:open

# 強制再起動
npm run dev:force

# ビルド
npm run build

# プレビュー
npm run preview

# 自動デプロイ
npm run deploy:auto
```

## トラブルシューティング

### ポート3000が使用中
```bash
# 既存のプロセスを停止
pkill -f "vite --port 3000"

# または強制再起動
npm run dev:force
```

### 依存関係の問題
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## プロジェクト構造

```
easy-genogram/
├── .vscode/           # Cursor/VS Code設定
│   ├── tasks.json     # タスク定義
│   ├── launch.json    # デバッグ設定
│   └── settings.json  # エディタ設定
├── components/        # Reactコンポーネント
├── contexts/          # React Context
├── public/            # 静的ファイル
├── start-dev.sh       # 自動起動スクリプト
└── package.json       # プロジェクト設定
```

## 自動化

- **フォルダを開く**: 自動でタスクが実行される設定
- **ファイル保存**: 自動フォーマット
- **Git**: 自動コミット・プッシュ機能
