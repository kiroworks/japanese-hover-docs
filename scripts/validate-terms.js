#!/usr/bin/env node
/**
 * validate-terms.js
 * data/*.jsonのデータ整合性をチェックする
 * ビルド前に自動実行される（prebuildに設定）
 *
 * チェック内容:
 * - 重複idがないか
 * - similarのidが実在するか
 * - 必須フィールドが揃っているか
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const files    = ['html.json', 'css.json', 'js.json'];

let hasError = false;

function error(msg) {
  console.error(`  ❌ ${msg}`);
  hasError = true;
}

function warn(msg) {
  console.warn(`  ⚠️  ${msg}`);
}

// 全データ読み込み
const allTerms = [];
for (const file of files) {
  const terms = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
  allTerms.push(...terms);
}

const allIds = new Set(allTerms.map(t => t.id));

console.log(`\n🔍 バリデーション開始（${allTerms.length}件）\n`);

for (const term of allTerms) {
  // 必須フィールドチェック
  const required = ['id', 'word', 'formal_name', 'formal_name_ja', 'category',
                    'aliases', 'mdn_url', 'summary', 'usage', 'examples',
                    'similar', 'mistakes', 'browser_support'];
  for (const field of required) {
    if (term[field] === undefined || term[field] === null) {
      error(`[${term.id}] 必須フィールド "${field}" がありません`);
    }
  }

  // カテゴリチェック
  if (!['HTML', 'CSS', 'JavaScript'].includes(term.category)) {
    error(`[${term.id}] 不正なカテゴリ: "${term.category}"`);
  }

  // examplesが空でないか
  if (!term.examples || term.examples.length === 0) {
    warn(`[${term.id}] examples が空です`);
  }

  // similarのidが実在するか
  for (const s of (term.similar || [])) {
    if (!allIds.has(s.id)) {
      error(`[${term.id}] similar の id "${s.id}" が存在しません`);
    }
  }

  // aliasesが配列か
  if (!Array.isArray(term.aliases) || term.aliases.length === 0) {
    warn(`[${term.id}] aliases が空です`);
  }

  // mdn_urlの形式チェック
  if (!term.mdn_url.startsWith('https://developer.mozilla.org')) {
    warn(`[${term.id}] mdn_url が MDN のURLではありません: ${term.mdn_url}`);
  }
}

// 重複idチェック
const ids = allTerms.map(t => t.id);
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
for (const dup of duplicates) {
  error(`重複したid: "${dup}"`);
}

if (hasError) {
  console.error(`\n❌ バリデーション失敗 — ビルドを中止します\n`);
  process.exit(1);
} else {
  console.log(`✅ バリデーション完了 — 問題なし\n`);
}
