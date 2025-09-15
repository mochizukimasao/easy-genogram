# Live Server ポート3000設定

## ワークスペース設定（完了済み）
プロジェクトの `.vscode/settings.json` に以下の設定を追加しました：

```json
{
  "liveServer.settings.port": 3000,
  "liveServer.settings.CustomBrowser": "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "liveServer.settings.donotShowInfoMsg": true,
  "liveServer.settings.donotVerifyTags": true,
  "liveServer.settings.ignoreFiles": [
    ".vscode/**",
    "**/*.scss",
    "**/*.sass",
    "**/*.ts",
    "**/*.tsx",
    "node_modules/**"
  ],
  "liveServer.settings.mount": [
    ["/", "./dist"]
  ]
}
```

## グローバル設定（推奨）
VSCodeのグローバル設定でもポート3000を固定したい場合は、以下の手順で設定してください：

1. `Cmd + Shift + P` でコマンドパレットを開く
2. "Preferences: Open Settings (JSON)" を選択
3. 以下の設定を追加：

```json
{
  "liveServer.settings.port": 3000,
  "liveServer.settings.CustomBrowser": "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
}
```

## 使用方法
1. HTMLファイルを右クリック
2. "Open with Live Server" を選択
3. 常にポート3000で起動され、Braveブラウザで開きます

## 注意事項
- ポート3000が既に使用されている場合は、Live Serverがエラーを表示します
- この場合、既存のサーバーを停止してからLive Serverを使用してください
