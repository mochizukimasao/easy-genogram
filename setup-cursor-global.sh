#!/bin/bash

# Cursor/VS Code グローバル設定セットアップスクリプト

echo "🔧 Cursor/VS Code グローバル設定をセットアップ中..."

# グローバル設定ディレクトリを作成
mkdir -p ~/.vscode

# グローバル設定ファイルを作成
cat > ~/.vscode/settings.json << 'EOF'
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "files.associations": {
    "*.tsx": "typescriptreact",
    "*.ts": "typescript"
  },
  "terminal.integrated.defaultProfile.osx": "zsh",
  "workbench.startupEditor": "none",
  "extensions.autoUpdate": true,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "workbench.colorTheme": "Default Dark+",
  "editor.minimap.enabled": true,
  "editor.wordWrap": "on",
  "editor.rulers": [80, 120],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true
}
EOF

# グローバルタスクファイルを作成
cat > ~/.vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🚀 Start Dev Server (Auto-detect)",
      "type": "shell",
      "command": "bash",
      "args": ["-c", "if [ -f package.json ]; then npm run dev; else echo 'No package.json found'; fi"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      },
      "isBackground": true,
      "runOptions": {
        "runOn": "folderOpen"
      }
    },
    {
      "label": "📦 Install Dependencies",
      "type": "shell",
      "command": "npm",
      "args": ["install"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "🛑 Stop All Dev Servers",
      "type": "shell",
      "command": "pkill",
      "args": ["-f", "vite|webpack|next"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
EOF

echo "✅ グローバル設定が完了しました！"
echo ""
echo "📋 設定内容:"
echo "   - エディタ設定: ~/.vscode/settings.json"
echo "   - タスク設定: ~/.vscode/tasks.json"
echo ""
echo "🎯 使用方法:"
echo "   1. プロジェクトフォルダを開く"
echo "   2. Cmd+Shift+P で 'Tasks: Run Task' を選択"
echo "   3. '🚀 Start Dev Server (Auto-detect)' を選択"
echo ""
echo "💡 ヒント:"
echo "   - プロジェクトに package.json がある場合、自動で npm run dev を実行"
echo "   - フォルダを開くたびに自動でタスクが実行されます"
