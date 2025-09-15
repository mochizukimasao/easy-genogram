#!/bin/bash

# かんたんジェノグラム デプロイスクリプト

echo "🚀 かんたんジェノグラムをデプロイ中..."

# 現在の変更を確認
echo "📋 現在の変更状況を確認中..."
git status

# 変更がある場合は確認
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  未コミットの変更があります。"
    echo "デプロイ前にコミット・プッシュしますか？ (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "📝 変更をコミット中..."
        git add .
        git commit -m "feat: デプロイ前のコミット $(date '+%Y-%m-%d %H:%M:%S')"
        
        echo "📤 GitHubにプッシュ中..."
        git push origin main
    else
        echo "❌ デプロイをキャンセルしました。"
        exit 1
    fi
else
    echo "✅ 未コミットの変更はありません。"
fi

# Vercelにデプロイ
echo "🌐 Vercelにデプロイ中..."
npx vercel --prod

echo "✅ デプロイ完了！"
echo "🔗 本番URL: https://easy-genogram.vercel.app"
