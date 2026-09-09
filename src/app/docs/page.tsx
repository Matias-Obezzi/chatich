import { getContext } from "@/lib/context";
import { remark } from 'remark';
import html from 'remark-html';
import { DocsClient } from "@/component/docs/DocsClient";

function escapeHtml(unsafe: string) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

type MdNode = {
  type: string;
  value?: string;
  lang?: string;
  depth?: number;
  children?: MdNode[];
  data?: { hProperties?: Record<string, string> };
};

export default async function DocsPage() {
  const context = await getContext();
  const lang = context.lang || "en";
  const readme = await import(`@/i18n/${lang}.md`);
  
  const headings: {id: string, text: string, level: number}[] = [];

  const remarkDocsPlugin = () => (tree: MdNode) => {
    function visit(node: MdNode) {
      if (node.type === 'heading') {
        const textNode = node.children?.find((c: MdNode) => c.type === 'text');
        if (textNode && textNode.value) {
          const text = textNode.value;
          const id = text.toLowerCase().replace(/[^\w\-]+/g, '-');
          node.data = node.data || {};
          node.data.hProperties = node.data.hProperties || {};
          node.data.hProperties.id = id;
          headings.push({ id, text, level: node.depth ?? 1 });
        }
      } else if (node.type === 'code') {
        const codeContent = escapeHtml(node.value || '');
        node.type = 'html';
        node.value = `
          <div class="code-wrapper relative group bg-[var(--surface-2)] rounded-xl p-4 my-4 border border-[var(--border)] font-mono text-sm overflow-x-auto shadow-lg">
            <button class="copy-btn absolute top-3 right-3 p-2 bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border border-[rgba(255,255,255,0.05)] cursor-pointer" aria-label="Copy code" title="Copy code">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <pre style="margin:0"><code class="language-${escapeHtml(node.lang || 'text')}">${codeContent}</code></pre>
          </div>
        `;
        delete node.children;
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    visit(tree);
  };

  const processedContent = await remark()
    .use(remarkDocsPlugin)
    .use(html, { sanitize: false })
    .process(readme.default);
    
  const originUrl = context.url ? new URL(context.url).origin : "";
  const url = originUrl.endsWith("/") ? originUrl.slice(0, -1) : originUrl;
  const htmlContent = processedContent.toString().replaceAll("{{PAGE}}", url);

  return <DocsClient html={htmlContent} headings={headings} lang={lang} />;
}
