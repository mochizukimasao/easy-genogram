#!/bin/bash

# かんたんジェノグラム 開発サーバー自動起動スクリプト

echo "🚀 かんたんジェノグラム開発サーバーを起動中..."

# ポート3000が使用中かチェック
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  ポート3000が既に使用中です。"
    echo "   既存のプロセスを停止しますか？ (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🛑 既存のプロセスを停止中..."
        pkill -f "vite --port 3000"
        sleep 2
    else
        echo "❌ 起動をキャンセルしました。"
        exit 1
    fi
fi

# 依存関係をインストール（必要に応じて）
if [ ! -d "node_modules" ]; then
    echo "📦 依存関係をインストール中..."
    npm install
fi

# 開発サーバーを起動
echo "🌟 開発サーバーを起動中..."
echo "   URL: http://localhost:3000"
echo "   停止するには Ctrl+C を押してください"
echo ""

npm run dev
