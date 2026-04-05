module.exports = function({ counts, allTerms, safeJson, generatedAt }) {
  const LANG_COLOR = {HTML:'var(--html-color)',CSS:'var(--css-color)',JavaScript:'var(--js-color)'};
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>用語一覧 — Japanese Hover Docs</title>
  <meta name="description" content="HTML・CSS・JavaScriptの用語一覧。Japanese Hover Docsが対応している${allTerms.length}件の用語フル解説。初心者向け日本語解説。">
  <meta property="og:title" content="用語一覧 — Japanese Hover Docs">
  <meta property="og:description" content="HTML・CSS・JavaScriptの${allTerms.length}件の用語を日本語で解説するVS Code拡張機能の用語辞典。">
  <meta property="og:url" content="https://kiroworks.com/tools/japanese-hover-docs/terms/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://kiroworks.com/tools/japanese-hover-docs/ogp.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://kiroworks.com/tools/japanese-hover-docs/terms/">
  <link rel="icon" href="../icon.png" type="image/png">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"WebPage","name":"用語一覧 — Japanese Hover Docs","description":"HTML・CSS・JavaScriptの用語一覧。初心者向け日本語解説。","url":"https://kiroworks.com/tools/japanese-hover-docs/terms/","isPartOf":{"@type":"WebSite","name":"Japanese Hover Docs","url":"https://kiroworks.com/tools/japanese-hover-docs/"}}
  <\/script>
  <!-- 生成日時: ${generatedAt} / 総用語数: ${allTerms.length}件 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root{--bg:#0d1117;--bg-2:#161b22;--bg-3:#21262d;--border:#30363d;--text:#e6edf3;--text-muted:#8b949e;--accent:#58a6ff;--accent-2:#3fb950;--accent-3:#d2a8ff;--warning:#f0883e;--html-color:#f0883e;--css-color:#58a6ff;--js-color:#f0e68c}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'Noto Sans JP',sans-serif;background:var(--bg);color:var(--text);line-height:1.7;overflow-x:hidden}
    header{position:sticky;top:0;background:rgba(13,17,23,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 32px;height:56px;display:flex;align-items:center;justify-content:space-between;z-index:100}
    .header-logo{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text-muted);text-decoration:none}
    .header-logo span{color:var(--accent)}
    .container{display:grid;grid-template-columns:240px 1fr;min-height:calc(100vh - 56px);overflow-x:hidden;width:100%}
    .sidebar{position:sticky;top:56px;height:calc(100vh - 56px);display:flex;flex-direction:column;border-right:1px solid var(--border)}
    .sidebar-search{padding:12px 12px 8px;flex-shrink:0;background:var(--bg);border-bottom:1px solid var(--border)}
    .search-input{width:100%;background:var(--bg-3);border:1px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:13px;font-family:'Noto Sans JP',sans-serif;outline:none;transition:border-color .2s}
    .search-input:focus{border-color:var(--accent)}
    .search-input::placeholder{color:var(--text-muted)}
    .sidebar-nav{flex:1;overflow-y:auto;padding:8px 0;min-height:0}
    .sidebar-nav::-webkit-scrollbar{width:3px}
    .sidebar-nav::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
    .sidebar-group{margin-bottom:2px}
    .sidebar-group-btn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:7px 12px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);background:none;border:none;cursor:pointer;transition:color .15s}
    .sidebar-group-btn:hover{color:var(--text)}
    .sidebar-group-btn .arrow{font-size:10px;transition:transform .2s}
    .sidebar-group-btn.open .arrow{transform:rotate(90deg)}
    .sidebar-group-items{overflow:hidden;max-height:0;transition:max-height .3s ease}
    .sidebar-group-items.open{max-height:none}
    .lang-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-right:6px}
    .sidebar-item{display:block;padding:5px 12px 5px 28px;font-size:12px;color:var(--text-muted);text-decoration:none;transition:color .15s,background .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'JetBrains Mono',monospace}
    .sidebar-item:hover{color:var(--text);background:var(--bg-2)}
    .sidebar-item.active{color:var(--accent);background:rgba(88,166,255,.08)}
    .main{padding:40px 48px;max-width:860px;min-width:0;overflow-x:hidden}
    .page-header{margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid var(--border)}
    .page-title{font-size:26px;font-weight:700;margin-bottom:6px;letter-spacing:-.01em}
    .page-desc{color:var(--text-muted);font-size:14px}
    .page-stats{display:flex;gap:16px;margin-top:12px;flex-wrap:wrap}
    .stat{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text-muted)}
    .stat span{font-weight:600}
    .stat .html{color:var(--html-color)}.stat .css{color:var(--css-color)}.stat .js{color:var(--js-color)}
    .category-section{margin-bottom:56px}
    .category-title{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
    .term-card{background:var(--bg-2);border:1px solid var(--border);border-radius:10px;margin-bottom:12px;overflow:hidden;scroll-margin-top:72px;transition:border-color .2s}
    .term-card:target,.term-card.highlighted{border-color:var(--accent)}
    .term-header{padding:16px 20px 14px;border-bottom:1px solid var(--border)}
    .term-title{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:600;color:var(--text);margin-bottom:5px;word-break:break-all;overflow-wrap:anywhere}
    .term-title .formal{color:var(--text-muted);font-weight:400}
    .term-title .ja{color:var(--text-muted);font-weight:400;font-family:'Noto Sans JP',sans-serif;font-size:12px}
    .term-summary{font-size:13px;color:var(--text-muted);line-height:1.6;word-break:break-word;overflow-wrap:break-word}
    .term-body{padding:16px 20px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
    .term-section-title{font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px}
    .term-usage{font-size:13px;color:var(--text);line-height:1.6;word-break:break-word;overflow-wrap:break-word}
    .term-code-block{background:var(--bg-3);border-radius:7px;overflow:hidden;max-width:100%}
    .code-header{display:flex;justify-content:space-between;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border)}
    .code-lang{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted)}
    .copy-btn{background:none;border:none;color:var(--text-muted);font-size:11px;cursor:pointer;padding:2px 7px;border-radius:3px;transition:color .2s,background .2s;font-family:'Noto Sans JP',sans-serif}
    .copy-btn:hover{color:var(--text);background:var(--border)}
    .copy-btn.copied{color:var(--accent-2)}
    pre{padding:10px 12px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7;color:var(--text);overflow-x:auto;white-space:pre;max-width:100%;box-sizing:border-box}
    .code-note{font-size:10px;color:var(--text-muted);padding:5px 10px 8px;font-style:italic}
    .term-full{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding-top:14px;border-top:1px solid var(--border)}
    .term-related-list,.term-mistakes-list,.term-error-list{list-style:none}
    .term-related-list li{font-size:12px;color:var(--text-muted);padding:3px 0;line-height:1.5}
    .term-related-list li a{font-family:'JetBrains Mono',monospace;color:var(--accent-3);text-decoration:none;font-size:11px}
    .term-related-list li a:hover{text-decoration:underline}
    .term-mistakes-list li{font-size:11px;color:var(--text-muted);padding:3px 0 3px 13px;position:relative;line-height:1.5}
    .term-mistakes-list li::before{content:'!';position:absolute;left:0;color:var(--warning);font-weight:700;font-size:10px}
    .term-error-list li{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--warning);background:rgba(240,136,62,.08);border:1px solid rgba(240,136,62,.2);border-radius:3px;padding:3px 7px;margin-bottom:3px}
    .term-footer{padding:10px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end}
    .mdn-link{font-size:11px;color:var(--accent);text-decoration:none;font-family:'JetBrains Mono',monospace}
    .mdn-link:hover{text-decoration:underline}
    .empty-state{text-align:center;padding:60px 20px;color:var(--text-muted);display:none}
    .empty-state.visible{display:block}
    .back-to-top{position:fixed;bottom:28px;right:28px;width:42px;height:42px;background:var(--bg-3);border:1px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;color:var(--text-muted);text-decoration:none;transition:all .2s;opacity:0;pointer-events:none;z-index:50}
    .back-to-top.visible{opacity:1;pointer-events:all}
    .back-to-top:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-2px)}
    .mobile-search{display:none;padding:8px 12px;background:var(--bg);border-bottom:1px solid var(--border);position:sticky;top:56px;z-index:90}
    .mobile-search-input{width:100%;background:var(--bg-3);border:1px solid var(--border);border-radius:6px;padding:8px 12px;color:var(--text);font-size:14px;font-family:'Noto Sans JP',sans-serif;outline:none;box-sizing:border-box}
    .mobile-search-input:focus{border-color:var(--accent)}
    @media(max-width:768px){
      .mobile-search{display:block}
      .container{grid-template-columns:1fr}
      .sidebar{display:none}
      .main{padding:10px 12px;width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:hidden;box-sizing:border-box}
      .term-body{display:block!important;padding:12px 14px;overflow-x:hidden;max-width:100%}
      .term-full{display:block;padding-top:12px;border-top:1px solid var(--border)}.term-full>div{margin-bottom:10px}.term-full>div:last-child{margin-bottom:0}
      .back-to-top{bottom:16px;right:16px}
      .term-card{border-radius:8px;margin-bottom:8px;overflow:hidden}
      .term-header{padding:12px 14px 10px}
      .term-title{font-size:13px!important;word-break:break-all!important;overflow-wrap:anywhere!important;white-space:normal!important}
      .term-summary{font-size:12px;word-break:break-word;overflow-wrap:break-word}
      .term-usage{font-size:12px;word-break:break-word;overflow-wrap:break-word}
      .term-code-block{overflow:hidden;max-width:100%}
      pre{font-size:10px;overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%;box-sizing:border-box}
      .page-header{margin-bottom:16px;padding-bottom:14px}
      .page-title{font-size:20px}
      .category-title{font-size:11px;margin-bottom:10px}
      .term-section-title{font-size:9px}.term-body>div{margin-bottom:12px}.term-body>div:last-child{margin-bottom:0}
      .term-related-list li{font-size:11px;overflow-wrap:break-word;word-break:break-word}
      .term-mistakes-list li{font-size:10px;overflow-wrap:break-word;word-break:break-word}
      .term-error-list li{font-size:9px;overflow-wrap:break-word;word-break:break-word}
      .page-stats{gap:8px;flex-wrap:wrap}
      .stat{font-size:11px}
    }
  </style>
</head>
<body>
<header>
  <a href="../" class="header-logo"><span>&gt;_</span> Japanese Hover Docs</a>
  <a href="https://github.com/kiroworks/japanese-hover-docs" target="_blank" rel="noopener" style="font-size:13px;color:var(--text-muted);text-decoration:none">GitHub</a>
</header>
<div class="mobile-search">
  <input type="text" class="mobile-search-input" id="mobileSearchInput" placeholder="用語を検索...">
</div>
<div class="container">
  <aside class="sidebar">
    <div class="sidebar-search">
      <input type="text" class="search-input" id="searchInput" placeholder="用語を検索...">
    </div>
    <nav class="sidebar-nav" id="sidebarContent"></nav>
  </aside>
  <main class="main">
    <div class="page-header">
      <h1 class="page-title">用語一覧</h1>
      <p class="page-desc">Japanese Hover Docs が対応している用語のフル解説。VS Codeのホバーより詳しい情報を確認できます。</p>
      <div class="page-stats">
        <div class="stat">HTML <span class="html">${counts.HTML}</span></div>
        <div class="stat">CSS <span class="css">${counts.CSS}</span></div>
        <div class="stat">JavaScript <span class="js">${counts.JavaScript}</span></div>
        <div class="stat">合計 <span>${allTerms.length}</span></div>
      </div>
    </div>
    <div id="termsContent"></div>
    <div class="empty-state" id="emptyState">
      <p style="font-size:28px;margin-bottom:10px">🔍</p>
      <p>「<span id="emptyQuery"></span>」に一致する用語が見つかりません</p>
    </div>
  </main>
</div>
<a href="#" class="back-to-top" id="backToTop" aria-label="トップに戻る">↑</a>
<script>
const TERMS_DATA=${safeJson};
const LANG_COLOR={HTML:'var(--html-color)',CSS:'var(--css-color)',JavaScript:'var(--js-color)'};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function buildTitle(t){const same=t.word.toLowerCase()===t.formal_name.toLowerCase();return same?\`\${esc(t.word)} <span class="ja">— \${esc(t.formal_name_ja)}</span>\`:\`\${esc(t.word)} <span class="formal">— \${esc(t.formal_name)}</span> <span class="ja">（\${esc(t.formal_name_ja)}）</span>\`}
function buildCard(t){
  const lang=t.category==='HTML'?'html':t.category==='CSS'?'css':'javascript';
  const ex=t.examples[0];
  const similar=t.similar.length>0?\`<div><div class="term-section-title">【関連】</div><ul class="term-related-list">\${t.similar.map(s=>{const r=TERMS_DATA.find(x=>x.id===s.id);const n=r?r.word:s.id;return\`<li><a href="#\${s.id}">\\\`\${esc(n)}\\\`</a> → \${esc(s.diff)}</li>\`}).join('')}</ul></div>\`:'';
  const mistakes=t.mistakes.length>0?\`<div><div class="term-section-title">【注意】</div><ul class="term-mistakes-list">\${t.mistakes.map(m=>\`<li>\${esc(m)}</li>\`).join('')}</ul></div>\`:'';
  const errors=t.error_patterns&&t.error_patterns.length>0?\`<div><div class="term-section-title">【エラー】</div><ul class="term-error-list">\${t.error_patterns.map(e=>\`<li>\${esc(e)}</li>\`).join('')}</ul></div>\`:'';
  const note=ex.note?\`<div class="code-note">\${esc(ex.note)}</div>\`:'';
  const fullRow=similar||mistakes||errors?\`<div class="term-full">\${similar}\${mistakes}\${errors}</div>\`:'';
  return \`<div class="term-card" id="\${t.id}" data-category="\${t.category}"><div class="term-header"><div class="term-title">\${buildTitle(t)}</div><div class="term-summary">\${esc(t.summary)}</div></div><div class="term-body"><div><div class="term-section-title">【用途】</div><div class="term-usage">\${esc(t.usage)}</div></div><div><div class="term-section-title">【構文】</div><div class="term-code-block"><div class="code-header"><span class="code-lang">\${lang}</span><button class="copy-btn" onclick="copyCode(this)">コピー</button></div><pre>\${esc(ex.code)}</pre>\${note}</div></div>\${fullRow}</div><div class="term-footer"><a href="\${t.mdn_url}" target="_blank" rel="noopener" class="mdn-link">MDN リファレンス（日本語）→</a></div></div>\`;
}
function buildSidebar(terms){
  const g={HTML:[],CSS:[],JavaScript:[]};terms.forEach(t=>g[t.category]&&g[t.category].push(t));
  return Object.entries(g).map(([l,items])=>{
    if(!items.length)return'';
    const color=LANG_COLOR[l];
    return \`<div class="sidebar-group"><button class="sidebar-group-btn open" onclick="toggleGroup(this)"><span style="display:flex;align-items:center"><span class="lang-dot" style="background:\${color}"></span>\${l}</span><span class="arrow">▶</span></button><div class="sidebar-group-items open">\${items.map(t=>\`<a href="#\${t.id}" class="sidebar-item" data-id="\${t.id}">\${t.word}</a>\`).join('')}</div></div>\`;
  }).join('');
}
function toggleGroup(btn){btn.classList.toggle('open');btn.nextElementSibling.classList.toggle('open')}
function buildContent(terms){
  const g={};terms.forEach(t=>{if(!g[t.category])g[t.category]=[];g[t.category].push(t);});
  return Object.entries(g).map(([l,items])=>\`<div class="category-section"><div class="category-title"><span style="background:\${LANG_COLOR[l]};width:9px;height:9px;border-radius:50%;display:inline-block"></span>\${l}</div>\${items.map(buildCard).join('')}</div>\`).join('');
}
document.getElementById('sidebarContent').innerHTML=buildSidebar(TERMS_DATA);
document.getElementById('termsContent').innerHTML=buildContent(TERMS_DATA);
// スマホ検索との同期
document.getElementById('mobileSearchInput').addEventListener('input',function(){
  document.getElementById('searchInput').value=this.value;
  document.getElementById('searchInput').dispatchEvent(new Event('input'));
});
document.getElementById('searchInput').addEventListener('input',function(){
  const q=this.value.toLowerCase().trim();
  const f=q?TERMS_DATA.filter(t=>t.word.toLowerCase().includes(q)||t.formal_name.toLowerCase().includes(q)||t.formal_name_ja.includes(q)||t.summary.includes(q)||t.aliases.some(a=>a.toLowerCase().includes(q))):TERMS_DATA;
  document.getElementById('termsContent').innerHTML=f.length?buildContent(f):'';
  document.getElementById('sidebarContent').innerHTML=buildSidebar(f);
  document.getElementById('emptyState').classList.toggle('visible',!f.length);
  document.getElementById('emptyQuery').textContent=q;
  observeCards();
});
function copyCode(btn){const code=btn.closest('.term-code-block').querySelector('pre').textContent;navigator.clipboard.writeText(code).then(()=>{btn.textContent='コピー完了！';btn.classList.add('copied');setTimeout(()=>{btn.textContent='コピー';btn.classList.remove('copied');},1500);})}
function setActive(id){
  document.querySelectorAll('.sidebar-item').forEach(el=>{
    el.classList.toggle('active',el.dataset.id===id);
  });
  const a=document.querySelector(\`.sidebar-item[data-id="\${id}"]\`);
  if(a){
    const nav=document.querySelector('.sidebar-nav');
    if(nav){
      const t=a.offsetTop,h=nav.clientHeight;
      if(t<nav.scrollTop||t>nav.scrollTop+h-40)nav.scrollTo({top:t-h/2,behavior:'smooth'});
    }
  }
}
function updateActive(){
  const cards=[...document.querySelectorAll('.term-card')];
  if(!cards.length)return;
  let best=cards[0].id;
  for(const c of cards){
    if(c.getBoundingClientRect().top<120)best=c.id;
  }
  setActive(best);
}
window.addEventListener('scroll',updateActive,{passive:true});
function observeCards(){setTimeout(updateActive,50);}
observeCards();
if(location.hash){const id=location.hash.slice(1);setTimeout(()=>{const el=document.getElementById(id);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});el.classList.add('highlighted');const a=document.querySelector(\`.sidebar-item[data-id="\${id}"]\`);if(a){document.querySelectorAll('.sidebar-item').forEach(x=>x.classList.remove('active'));a.classList.add('active');}}},300);}
const btt=document.getElementById('backToTop');
window.addEventListener('scroll',()=>btt.classList.toggle('visible',window.scrollY>400),{passive:true});
btt.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});
</script>
</body>
</html>`;
};
