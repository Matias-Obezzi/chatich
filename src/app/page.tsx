import { getContext } from "@/lib/context";
import { remark } from 'remark';
import html from 'remark-html';

export default async function Page() {
  const context = await getContext();
  const readme = await import(`@/i18n/${context.lang}.md`);
  const processedContent = await remark()
    .use(html)
    .process(readme.default);
  const url = context.url.endsWith("/") ? context.url.slice(0, -1) : context.url;
  return (
    <>
      <style>{`
        body {
          background: linear-gradient(177.6deg, rgba(20,0,113,1) 15.3%, rgba(1,0,62,1) 91.3%);
          color: white;
          padding: 2rem;
        }
      `}</style>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg prose [&_code]:whitespace-normal" dangerouslySetInnerHTML={{ __html: processedContent.toString().replaceAll("{{PAGE}}", url) }} />
    </>
  )
}
