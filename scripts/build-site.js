#!/usr/bin/env node
const fs   = require('fs');
const path = require('path');

const DATA_DIR  = path.join(__dirname, '../data');
const SITE_DIR  = path.join(__dirname, '../site');
const TERMS_DIR = path.join(SITE_DIR, 'terms');

if (!fs.existsSync(SITE_DIR))  { fs.mkdirSync(SITE_DIR, { recursive: true }); }
if (!fs.existsSync(TERMS_DIR)) { fs.mkdirSync(TERMS_DIR, { recursive: true }); }

const files    = ['html.json', 'css.json', 'js.json'];
const allTerms = [];
for (const file of files) {
  const terms = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
  allTerms.push(...terms);
}

const counts = {
  HTML:       allTerms.filter(t => t.category === 'HTML').length,
  CSS:        allTerms.filter(t => t.category === 'CSS').length,
  JavaScript: allTerms.filter(t => t.category === 'JavaScript').length,
};

console.log(`  データ読み込み: ${allTerms.length}件`);

const safeJson = JSON.stringify(allTerms)
  .replace(/</g, '\\u003c')
  .replace(/>/g, '\\u003e')
  .replace(/&/g, '\\u0026');

// terms/index.htmlを別ファイルから読み込んで生成
const templatePath = path.join(__dirname, 'terms-template.js');
const buildTermsPage = require(templatePath);
const termsHtml = buildTermsPage({ counts, allTerms, safeJson, generatedAt: new Date().toISOString() });

fs.writeFileSync(path.join(TERMS_DIR, 'index.html'), termsHtml, 'utf-8');
console.log(`  ✅ site/terms/index.html 生成完了`);

const indexPath = path.join(SITE_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf-8');
  html = html
    .replace(/(<div class="coverage-count html">)\d+(<\/div>)/, `$1${counts.HTML}$2`)
    .replace(/(<div class="coverage-count css">)\d+(<\/div>)/, `$1${counts.CSS}$2`)
    .replace(/(<div class="coverage-count js">)\d+(<\/div>)/, `$1${counts.JavaScript}$2`);

  // VS CodeダウンロードリンクをURLで修正
  html = html.replace(
    /https:\/\/marketplace\.visualstudio\.com\/items\?itemName=kiroworks\.japanese-hover-docs/g,
    'https://code.visualstudio.com/download'
  );
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`  ✅ site/index.html 更新完了（HTML:${counts.HTML} CSS:${counts.CSS} JS:${counts.JavaScript}）`);
}

console.log(`\n🎉 サイトビルド完了（合計${allTerms.length}件）`);
