# Japanese Hover Docs

HTML・CSS・JavaScriptの用語にカーソルを当てると日本語解説が表示されるVS Code拡張機能。

## 開発ステータス
現在テスト版（v0.5.0-test）。HTML・CSS・JS各5件、計15件の用語に対応。

## フォルダ構成
```
data/        用語データ（JSONで管理）
scripts/     ビルドスクリプト
extension/   VS Code拡張本体
```

## 用語の追加方法
1. `data/html.json` `data/css.json` `data/js.json` を編集
2. `cd extension && npm run build` を実行
3. `npm run package` でvsixを生成

## リンク
- https://kiroworks.com/tools/japanese-hover-docs
