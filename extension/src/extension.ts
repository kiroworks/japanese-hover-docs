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

// 利用可能なセクション
type Section = '用途' | '構文' | '関連' | '注意' | 'エラー';
const ALL_SECTIONS: Section[] = ['用途', '構文', '関連', '注意', 'エラー'];

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
  try {
    const config = vscode.workspace.getConfiguration('japaneseHoverDocs');
    if (!config.get<boolean>('enabled', true)) { return undefined; }

    const wordRange = document.getWordRangeAtPosition(position, /[\w.:-]+/);
    if (!wordRange) { return undefined; }

    // コロン・セミコロンを末尾から除去（display: → display）
    const raw = document.getText(wordRange).toLowerCase().replace(/[:;]+$/, '');
    let term  = termMap.get(raw);

    // ドット区切りで部分検索（例: JSON.stringify → stringify）
    if (!term && raw.includes('.')) {
      for (const part of raw.split('.')) {
        term = termMap.get(part);
        if (term) { break; }
      }
    }

    // ハイフン区切りで部分検索（例: padding-top → padding）
    if (!term && raw.includes('-')) {
      for (const part of raw.split('-')) {
        term = termMap.get(part);
        if (term) { break; }
      }
    }

    if (!term || !categories.includes(term.category)) { return undefined; }

    return new vscode.Hover(buildContent(term, config), wordRange);
  } catch (err) {
    console.error('[Japanese Hover Docs] エラー:', err);
    return undefined;
  }
}

function buildContent(term: Term, config: vscode.WorkspaceConfiguration): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  md.isTrusted = true;

  // 表示セクションの設定を取得（デフォルトは全セクション）
  const enabledSections = config.get<Section[]>('sections', ALL_SECTIONS);
  // 表示順の設定を取得（デフォルトはデフォルト順）
  const sectionOrder    = config.get<Section[]>('sectionOrder', ALL_SECTIONS);

  // sectionOrderに基づいてenabledSectionsを並び替え
  const orderedSections = sectionOrder.filter(s => enabledSections.includes(s));
  // sectionOrderにないものは末尾に追加
  for (const s of enabledSections) {
    if (!orderedSections.includes(s)) { orderedSections.push(s); }
  }

  // タイトル：wordとformal_nameが同じ場合はformal_nameを省略
  const isSameName = term.word.toLowerCase() === term.formal_name.toLowerCase();
  const title = isSameName
    ? `**${term.word}（${term.formal_name_ja}）**`
    : `**${term.word} — ${term.formal_name}（${term.formal_name_ja}）**`;
  md.appendMarkdown(`${title}\n\n`);

  // 概要
  md.appendMarkdown(`${term.summary}\n\n`);

  // 区切り線（1本だけ）
  md.appendMarkdown(`---\n\n`);

  const lang = term.category === 'HTML' ? 'html'
             : term.category === 'CSS'  ? 'css'
             : 'javascript';

  // 指定されたセクションを指定された順番で表示
  for (const section of orderedSections) {
    switch (section) {
      case '用途':
        if (term.usage) {
          md.appendMarkdown(`**【用途】**\n\n${term.usage}\n\n`);
        }
        break;

      case '構文':
        if (term.examples.length > 0) {
          md.appendMarkdown(`**【構文】**\n\n`);
          const ex = term.examples[0];
          md.appendCodeblock(ex.code, lang);
          if (ex.note) { md.appendMarkdown(`*${ex.note}*\n\n`); }
        }
        break;

      case '関連':
        if (term.similar.length > 0) {
          md.appendMarkdown(`**【関連】**\n\n`);
          for (const s of term.similar) {
            const rel  = TERMS.find(t => t.id === s.id);
            const name = rel ? `\`${rel.word}\`` : `\`${s.id}\``;
            md.appendMarkdown(`- ${name} → ${s.diff}\n`);
          }
          md.appendMarkdown('\n');
        }
        break;

      case '注意':
        if (term.mistakes.length > 0) {
          md.appendMarkdown(`**【注意】**\n\n- ${term.mistakes[0]}\n\n`);
        }
        break;

      case 'エラー':
        if (term.error_patterns && term.error_patterns.length > 0) {
          md.appendMarkdown(`**【エラー】**\n\n`);
          for (const e of term.error_patterns) {
            md.appendMarkdown(`- \`${e}\`\n`);
          }
          md.appendMarkdown('\n');
        }
        break;
    }
  }

  // フッター
  const termsUrl = `https://kiroworks.com/tools/japanese-hover-docs/terms/#${term.id}`;
  md.appendMarkdown(`[詳しく見る →](${termsUrl}) &nbsp;&nbsp; [MDN リファレンス（日本語）](${term.mdn_url})`);

  return md;
}
