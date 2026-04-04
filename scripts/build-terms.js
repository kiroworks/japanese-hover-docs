#!/usr/bin/env node
const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const OUT_FILE = path.join(__dirname, '../extension/src/terms.generated.ts');

const files    = ['html.json', 'css.json', 'js.json'];
const allTerms = [];

for (const file of files) {
  const terms = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
  allTerms.push(...terms);
  console.log(`  読み込み: ${file} (${terms.length}件)`);
}

// 重複idチェック
const ids = allTerms.map(t => t.id);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dup.length > 0) { console.error(`重複id: ${dup.join(', ')}`); process.exit(1); }

const ts = `// 自動生成ファイル。編集不要。data/*.jsonを編集してnpm run buildを実行してください。
// 生成日時: ${new Date().toISOString()} / 総用語数: ${allTerms.length}件

export interface Term {
  id: string; word: string; formal_name: string; formal_name_ja: string;
  category: 'HTML' | 'CSS' | 'JavaScript'; aliases: string[]; mdn_url: string;
  summary: string; usage: string;
  examples: Array<{ code: string; note: string }>;
  similar: Array<{ id: string; diff: string }>;
  mistakes: string[]; browser_support: string; error_patterns?: string[];
}

export const TERMS: Term[] = ${JSON.stringify(allTerms, null, 2)};

export function buildTermMap(): Map<string, Term> {
  const map = new Map<string, Term>();
  for (const term of TERMS) {
    for (const alias of term.aliases) { map.set(alias.toLowerCase(), term); }
  }
  return map;
}
`;

fs.writeFileSync(OUT_FILE, ts, 'utf-8');
console.log(`\n✅ 生成完了: ${allTerms.length}件`);
