#!/usr/bin/env node
/**
 * build-site.js
 * data/*.json → site/index.html・site/terms/index.html を自動生成する
 *
 * 使い方: node scripts/build-site.js
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR  = path.join(__dirname, '../data');
const SITE_DIR  = path.join(__dirname, '../site');
const TERMS_DIR = path.join(SITE_DIR, 'terms');

// ディレクトリがなければ作成
if (!fs.existsSync(SITE_DIR))  { fs.mkdirSync(SITE_DIR, { recursive: true }); }
if (!fs.existsSync(TERMS_DIR)) { fs.mkdirSync(TERMS_DIR, { recursive: true }); }

// 全データ読み込み
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

// ===== terms/index.html を生成 =====
const termsDataJson = JSON.stringify(allTerms);

const termsHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>用語一覧 — Japanese Hover Docs</title>
  <meta name="description" content="HTML・CSS・JavaScriptの用語一覧。Japanese Hover Docsが対応している用語のフル解説ページ。">
  <meta property="og:title" content="用語一覧 — Japanese Hover Docs">
  <meta property="og:description" content="HTML・CSS・JavaScriptの用語にカーソルを当てると日本語解説が表示されるVS Code拡張機能の用語一覧ページ。">
  <meta property="og:url" content="https://kiroworks.com/tools/japanese-hover-docs/terms/">
  <meta property="og:type" content="website">
  <link rel="canonical" href="https://kiroworks.com/tools/japanese-hover-docs/terms/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <!-- 生成日時: ${new Date().toISOString()} / 総用語数: ${allTerms.length}件 -->
  <style>
    :root {
      --bg:#0d1117; --bg-2:#161b22; --bg-3:#21262d; --border:#30363d;
      --text:#e6edf3; --text-muted:#8b949e;
      --accent:#58a6ff; --accent-2:#3fb950; --accent-3:#d2a8ff; --warning:#f0883e;
      --html-color:#f0883e; --css-color:#58a6ff; --js-color:#f0e68c;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'Noto Sans JP',sans-serif;background:var(--bg);color:var(--text);line-height:1.7}
    header{position:sticky;top:0;background:rgba(13,17,23,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 32px;height:56px;display:flex;align-items:center;justify-content:space-between;z-index:100}
    .header-logo{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text-muted);text-decoration:none}
    .header-logo span{color:var(--accent)}
    .container{display:grid;grid-template-columns:240px 1fr;min-height:calc(100vh - 56px)}
    .sidebar{position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto;border-right:1px solid var(--border);padding:24px 0}
    .sidebar::-webkit-scrollbar{width:4px}
    .sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
    .sidebar-search{padding:0 16px 16px}
    .search-input{width:100%;background:var(--bg-3);border:1px solid var(--border);border-radius:6px;padding:8px 12px;color:var(--text);font-size:13px;font-family:'Noto Sans JP',sans-serif;outline:none;transition:border-color .2s}
    .search-input:focus{border-color:var(--accent)}
    .search-input::placeholder{color:var(--text-muted)}
    .sidebar-group{margin-bottom:8px}
    .sidebar-group-title{padding:6px 16px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);display:flex;align-items:center;gap:8px}
    .lang-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    .sidebar-item{display:block;padding:6px 16px 6px 32px;font-size:13px;color:var(--text-muted);text-decoration:none;transition:color .15s,background .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'JetBrains Mono',monospace}
    .sidebar-item:hover{color:var(--text);background:var(--bg-2)}
    .sidebar-item.active{color:var(--accent);background:rgba(88,166,255,.08)}
    .main{padding:48px;max-width:860px}
    .page-header{margin-bottom:48px;padding-bottom:24px;border-bottom:1px solid var(--border)}
    .page-title{font-size:28px;font-weight:700;margin-bottom:8px;letter-spacing:-.01em}
    .page-desc{color:var(--text-muted);font-size:14px}
    .page-stats{display:flex;gap:20px;margin-top:16px}
    .stat{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text-muted)}
    .stat span{font-weight:600}
    .stat .html{color:var(--html-color)}
    .stat .css{color:var(--css-color)}
    .stat .js{color:var(--js-color)}
    .category-section{margin-bottom:64px}
    .category-title{font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
    .term-card{background:var(--bg-2);border:1px solid var(--border);border-radius:12px;margin-bottom:16px;overflow:hidden;scroll-margin-top:80px;transition:border-color .2s}
    .term-card:target,.term-card.highlighted{border-color:var(--accent)}
    .term-header{padding:20px 24px 16px;border-bottom:1px solid var(--border)}
    .term-title{font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:600;color:var(--text);margin-bottom:6px}
    .term-title .formal{color:var(--text-muted);font-weight:400}
    .term-title .ja{color:var(--text-muted);font-weight:400;font-family:'Noto Sans JP',sans-serif;font-size:13px}
    .term-summary{font-size:14px;color:var(--text-muted);line-height:1.6}
    .term-body{padding:20px 24px;display:grid;grid-template-columns:1fr 1fr;gap:24px}
    .term-section-title{font-size:11px;font-weight:700;letter-spacing:.06em;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px}
    .term-usage{font-size:13px;color:var(--text);line-height:1.6}
    .term-code-block{background:var(--bg-3);border-radius:8px;overflow:hidden}
    .code-header{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}
    .code-lang{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-muted)}
    .copy-btn{background:none;border:none;color:var(--text-muted);font-size:11px;cursor:pointer;padding:2px 8px;border-radius:4px;transition:color .2s,background .2s;font-family:'Noto Sans JP',sans-serif}
    .copy-btn:hover{color:var(--text);background:var(--border)}
    .copy-btn.copied{color:var(--accent-2)}
    pre{padding:12px 14px;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.7;color:var(--text);overflow-x:auto;white-space:pre}
    .code-note{font-size:11px;color:var(--text-muted);padding:6px 12px 10px;font-style:italic}
    .term-full{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-top:16px;border-top:1px solid var(--border)}
    .term-related-list,.term-mistakes-list,.term-error-list{list-style:none}
    .term-related-list li{font-size:13px;color:var(--text-muted);padding:4px 0;line-height:1.5}
    .term-related-list li a{font-family:'JetBrains Mono',monospace;color:var(--accent-3);text-decoration:none;font-size:12px}
    .term-related-list li a:hover{text-decoration:underline}
    .term-mistakes-list li{font-size:12px;color:var(--text-muted);padding:4px 0 4px 14px;position:relative;line-height:1.5}
    .term-mistakes-list li::before{content:'!';position:absolute;left:0;color:var(--warning);font-weight:700;font-size:11px}
    .term-error-list li{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--warning);background:rgba(240,136,62,.08);border:1px solid rgba(240,136,62,.2);border-radius:4px;padding:4px 8px;margin-bottom:4px}
    .term-footer{padding:12px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end}
    .mdn-link{font-size:12px;color:var(--accent);text-decoration:none;font-family:'JetBrains Mono',monospace}
    .mdn-link:hover{text-decoration:underline}
    .empty-state{text-align:center;padding:60px 20px;color:var(--text-muted);display:none}
    .empty-state.visible{display:block}
    @media(max-width:768px){.container{grid-template-columns:1fr}.sidebar{display:none}.main{padding:24px 16px}.term-body{grid-template-columns:1fr}.term-full{grid-template-columns:1fr}}
  </style>
</head>
<body>
<header>
  <a href="../" class="header-logo"><span>&gt;_</span> Japanese Hover Docs</a>
  <a href="https://github.com/kiroworks/japanese-hover-docs" target="_blank" rel="noopener" style="font-size:13px;color:var(--text-muted);text-decoration:none">GitHub</a>
</header>
<div class="container">
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-search">
      <input type="text" class="search-input" id="searchInput" placeholder="用語を検索...">
    </div>
    <div id="sidebarContent"></div>
  </aside>
  <main class="main">
    <div class="page-header">
      <h1 class="page-title">用語一覧</h1>
      <p class="page-desc">Japanese Hover Docs が対応している用語のフル解説です。VS Codeのホバーより詳しい情報を確認できます。</p>
      <div class="page-stats">
        <div class="stat">HTML <span class="html">${counts.HTML}</span></div>
        <div class="stat">CSS <span class="css">${counts.CSS}</span></div>
        <div class="stat">JavaScript <span class="js">${counts.JavaScript}</span></div>
        <div class="stat">合計 <span>${allTerms.length}</span></div>
      </div>
    </div>
    <div id="termsContent"></div>
    <div class="empty-state" id="emptyState">
      <p style="font-size:32px;margin-bottom:12px">🔍</p>
      <p>「<span id="emptyQuery"></span>」に一致する用語が見つかりません</p>
    </div>
  </main>
</div>
<script>
const TERMS_DATA = ${termsDataJson};
const LANG_COLOR = {HTML:'var(--html-color)',CSS:'var(--css-color)',JavaScript:'var(--js-color)'};

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

function buildTitle(t){
  const same = t.word.toLowerCase()===t.formal_name.toLowerCase();
  return same
    ? \`<span>\${esc(t.word)}</span> <span class="ja">— \${esc(t.formal_name_ja)}</span>\`
    : \`<span>\${esc(t.word)}</span> <span class="formal">— \${esc(t.formal_name)}</span> <span class="ja">（\${esc(t.formal_name_ja)}）</span>\`;
}

function buildCard(t){
  const lang=t.category==='HTML'?'html':t.category==='CSS'?'css':'javascript';
  const ex=t.examples[0];
  const similar=t.similar.length>0?\`<div><div class="term-section-title">【関連】</div><ul class="term-related-list">\${t.similar.map(s=>{const r=TERMS_DATA.find(x=>x.id===s.id);const n=r?r.word:s.id;return\`<li><a href="#\${s.id}">\\\`\${esc(n)}\\\`</a> → \${esc(s.diff)}</li>\`}).join('')}</ul></div>\`:'';
  const mistakes=t.mistakes.length>0?\`<div><div class="term-section-title">【注意】</div><ul class="term-mistakes-list">\${t.mistakes.map(m=>\`<li>\${esc(m)}</li>\`).join('')}</ul></div>\`:'';
  const errors=t.error_patterns&&t.error_patterns.length>0?\`<div><div class="term-section-title">【エラー】</div><ul class="term-error-list">\${t.error_patterns.map(e=>\`<li>\${esc(e)}</li>\`).join('')}</ul></div>\`:'';
  const note=ex.note?\`<div class="code-note">\${esc(ex.note)}</div>\`:'';
  return\`<div class="term-card" id="\${t.id}" data-category="\${t.category}">
    <div class="term-header"><div class="term-title">\${buildTitle(t)}</div><div class="term-summary">\${esc(t.summary)}</div></div>
    <div class="term-body">
      <div><div class="term-section-title">【用途】</div><div class="term-usage">\${esc(t.usage)}</div></div>
      <div><div class="term-section-title">【構文】</div><div class="term-code-block"><div class="code-header"><span class="code-lang">\${lang}</span><button class="copy-btn" onclick="copyCode(this)">コピー</button></div><pre>\${esc(ex.code)}</pre>\${note}</div></div>
      <div class="term-full">\${similar}\${mistakes}\${errors}</div>
    </div>
    <div class="term-footer"><a href="\${t.mdn_url}" target="_blank" rel="noopener" class="mdn-link">MDN リファレンス（日本語）→</a></div>
  </div>\`;}

function buildSidebar(terms){
  const g={HTML:[],CSS:[],JavaScript:[]};
  terms.forEach(t=>g[t.category]&&g[t.category].push(t));
  return Object.entries(g).map(([l,items])=>items.length?\`<div class="sidebar-group"><div class="sidebar-group-title"><span class="lang-dot" style="background:\${LANG_COLOR[l]}"></span>\${l}</div>\${items.map(t=>\`<a href="#\${t.id}" class="sidebar-item" data-id="\${t.id}">\${t.word}</a>\`).join('')}</div>\`:'').join('');
}

function buildContent(terms){
  const g={};terms.forEach(t=>{if(!g[t.category])g[t.category]=[];g[t.category].push(t);});
  return Object.entries(g).map(([l,items])=>\`<div class="category-section"><div class="category-title"><span style="background:\${LANG_COLOR[l]};width:10px;height:10px;border-radius:50%;display:inline-block"></span>\${l}</div>\${items.map(buildCard).join('')}</div>\`).join('');
}

document.getElementById('sidebarContent').innerHTML=buildSidebar(TERMS_DATA);
document.getElementById('termsContent').innerHTML=buildContent(TERMS_DATA);

document.getElementById('searchInput').addEventListener('input',function(){
  const q=this.value.toLowerCase().trim();
  const f=q?TERMS_DATA.filter(t=>t.word.toLowerCase().includes(q)||t.formal_name.toLowerCase().includes(q)||t.formal_name_ja.includes(q)||t.summary.includes(q)||t.aliases.some(a=>a.toLowerCase().includes(q))):TERMS_DATA;
  document.getElementById('termsContent').innerHTML=f.length?buildContent(f):'';
  document.getElementById('sidebarContent').innerHTML=buildSidebar(f);
  document.getElementById('emptyState').classList.toggle('visible',!f.length);
  document.getElementById('emptyQuery').textContent=q;
});

function copyCode(btn){
  const code=btn.closest('.term-code-block').querySelector('pre').textContent;
  navigator.clipboard.writeText(code).then(()=>{btn.textContent='コピー完了！';btn.classList.add('copied');setTimeout(()=>{btn.textContent='コピー';btn.classList.remove('copied');},1500);});
}

const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.sidebar-item').forEach(el=>el.classList.remove('active'));const a=document.querySelector(\`.sidebar-item[data-id="\${e.target.id}"]\`);if(a)a.classList.add('active');}});},{threshold:0.3});
document.querySelectorAll('.term-card').forEach(el=>obs.observe(el));

if(location.hash){const id=location.hash.slice(1);setTimeout(()=>{const el=document.getElementById(id);if(el){el.scrollIntoView({behavior:'smooth'});el.classList.add('highlighted');}},100);}
</script>
</body>
</html>`;

fs.writeFileSync(path.join(TERMS_DIR, 'index.html'), termsHtml, 'utf-8');
console.log(`  ✅ site/terms/index.html 生成完了`);

// ===== site/index.html の用語数を動的に更新 =====
const indexPath = path.join(SITE_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf-8');
  // 用語数の数字を実際のデータから更新
  html = html
    .replace(/(<div class="coverage-count html">)\d+(<\/div>)/, `$1${counts.HTML}$2`)
    .replace(/(<div class="coverage-count css">)\d+(<\/div>)/, `$1${counts.CSS}$2`)
    .replace(/(<div class="coverage-count js">)\d+(<\/div>)/, `$1${counts.JavaScript}$2`);
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`  ✅ site/index.html の用語数を更新（HTML:${counts.HTML} CSS:${counts.CSS} JS:${counts.JavaScript}）`);
} else {
  console.log(`  ⚠️  site/index.html が見つかりません（スキップ）`);
}

console.log(`\n🎉 サイトビルド完了`);
