# Japanese Hover Docs

HTML・CSS・JavaScriptの用語にカーソルを当てると日本語解説が表示されるVS Code拡張機能。

## インストール

VS Code の拡張機能パネルで「Japanese Hover Docs」を検索してインストール。

## 開発者向けセットアップ

```bash
git clone https://github.com/kiroworks/japanese-hover-docs.git
cd japanese-hover-docs
cd extension && npm install
npm run build
```

## 用語の追加方法

1. `data/html.json` `data/css.json` `data/js.json` を編集
2. `cd extension && npm run build`（バリデーション→ビルド→サイト生成が自動実行）
3. `npm run package` で .vsix を生成

## ブランチ運用

```
main    本番（リリース済み）
develop 開発中
```

変更は develop で行い、main にマージしてリリース。

## コミットメッセージ規則

```
feat: 新機能
fix:  バグ修正
data: 用語データの追加・修正
docs: ドキュメント変更
```

## リンク

- [サービスページ](https://kiroworks.com/tools/japanese-hover-docs)
- [用語一覧](https://kiroworks.com/tools/japanese-hover-docs/terms/)
- [バグ報告・要望](https://github.com/kiroworks/japanese-hover-docs/issues)
