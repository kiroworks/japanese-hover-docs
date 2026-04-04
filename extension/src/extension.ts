import * as vscode from 'vscode';
import { TERMS, Term, buildTermMap } from './terms.generated';

const termMap = buildTermMap();

const LANG_CATEGORY: Record<string, string[]> = {
  html:             ['HTML'],
  css:              ['CSS'],
  scss:             ['CSS'],
  javascript:       ['JavaScript'],
  javascriptreact:  ['JavaScript'],
  typescript:       ['JavaScript'],
  typescriptreact:  ['JavaScript'],
};

export function activate(context: vscode.ExtensionContext): void {
  for (const [lang, categories] of Object.entries(LANG_CATEGORY)) {
    context.subscriptions.push(
      vscode.languages.registerHoverProvider(
        { language: lang },
        { provideHover: (doc, pos) => provideHover(doc, pos, categories) }
      )
    );
  }
}

export function deactivate(): void {}

function provideHover(
  document: vscode.TextDocument,
  position: vscode.Position,
  categories: string[]
): vscode.Hover | undefined {
  const config = vscode.workspace.getConfiguration('japaneseHoverDocs');
  if (!config.get<boolean>('enabled', true)) { return undefined; }

  const wordRange = document.getWordRangeAtPosition(position, /[\w.-]+/);
  if (!wordRange) { return undefined; }

  const raw = document.getText(wordRange).toLowerCase();
  let term  = termMap.get(raw);

  if (!term && raw.includes('.')) {
    for (const part of raw.split('.')) {
      term = termMap.get(part);
      if (term) { break; }
    }
  }

  if (!term || !categories.includes(term.category)) { return undefined; }

  return new vscode.Hover(buildContent(term), wordRange);
}

function buildContent(term: Term): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  md.isTrusted = true;

  // タイトル（太字）
  md.appendMarkdown(`**${term.word} — ${term.formal_name}（${term.formal_name_ja}）**\n\n`);

  // 概要
  md.appendMarkdown(`${term.summary}\n\n`);

  // 区切り線（1本だけ）
  md.appendMarkdown(`---\n\n`);

  // 【用途】
  if (term.usage) {
    md.appendMarkdown(`**【用途】**\n\n${term.usage}\n\n`);
  }

  // 【構文】
  if (term.examples.length > 0) {
    md.appendMarkdown(`**【構文】**\n\n`);
    const lang = term.category === 'HTML' ? 'html' : term.category === 'CSS' ? 'css' : 'javascript';
    const ex   = term.examples[0];
    md.appendCodeblock(ex.code, lang);
    if (ex.note) { md.appendMarkdown(`*${ex.note}*\n\n`); }
  }

  // 【関連】
  if (term.similar.length > 0) {
    md.appendMarkdown(`**【関連】**\n\n`);
    for (const s of term.similar) {
      const rel  = TERMS.find(t => t.id === s.id);
      const name = rel ? `\`${rel.word}\`` : `\`${s.id}\``;
      md.appendMarkdown(`- ${name} → ${s.diff}\n`);
    }
    md.appendMarkdown('\n');
  }

  // 【注意】（最重要の1件のみ）
  if (term.mistakes.length > 0) {
    md.appendMarkdown(`**【注意】**\n\n- ${term.mistakes[0]}\n\n`);
  }

  // 【エラー】（error_patternsがある場合）
  if (term.error_patterns && term.error_patterns.length > 0) {
    md.appendMarkdown(`**【エラー】**\n\n`);
    for (const e of term.error_patterns) {
      md.appendMarkdown(`- \`${e}\`\n`);
    }
    md.appendMarkdown('\n');
  }

  md.appendMarkdown(`[MDN リファレンス（日本語）](${term.mdn_url})`);
  return md;
}
