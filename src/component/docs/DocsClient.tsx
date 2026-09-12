'use client'

import React, { useRef, MouseEvent } from 'react'
import { toast } from '@uiness/toast'
import { useActiveSection } from '@uiness/scroll'
import SiteLayout from '../SiteLayout'
import { Chakra_Petch, Inter, JetBrains_Mono } from 'next/font/google'

const chakra = Chakra_Petch({ weight: ['400', '600', '700'], subsets: ['latin'], variable: '--font-chakra' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

interface HeadingInfo {
  id: string;
  text: string;
  level: number;
}

interface DocsClientProps {
  html: string;
  headings: HeadingInfo[];
  lang: string;
}

export function DocsClient({ html, headings, lang }: DocsClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const activeIndex = useActiveSection(containerRef, { selector: 'h2, h3', anchor: 0.2 })

  const handleCopy = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('.copy-btn');
    if (btn) {
      const wrapper = btn.closest('.code-wrapper');
      const code = wrapper?.querySelector('code')?.innerText;
      if (code) {
        navigator.clipboard.writeText(code);
        toast.success('Copied to clipboard');
      }
    }
  }

  return (
    <div 
      className={`${chakra.variable} ${inter.variable} ${mono.variable} min-h-screen font-sans`}
      style={{ 
        backgroundColor: 'var(--bg)', 
        color: 'var(--text)',
        '--bg': '#06060B', 
        '--bg-2': '#0B0B14', 
        '--surface': '#12121D', 
        '--surface-2': '#1A1A2B',
        '--border': 'rgba(255,255,255,.09)', 
        '--text': '#EDEDF5', 
        '--muted': '#8E8EA8',
        '--neon': '#8B5CF6', 
        '--neon-2': '#22D3EE', 
        '--neon-3': '#53FC18',
      } as React.CSSProperties}
    >
      <SiteLayout lang={lang} mainClassName="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[1fr_250px] gap-12 items-start">
        
        {/* Document */}
        <div 
          ref={containerRef}
          onClick={handleCopy}
          className="prose-content min-w-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Sidebar TOC */}
        <aside className="sticky top-28 hidden md:block border-l pl-6" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-title text-xs tracking-widest text-[var(--muted)] mb-5 uppercase">Contents</h3>
          <ul className="space-y-3">
            {headings.map((heading, i) => (
              <li key={heading.id} style={{ marginLeft: (heading.level - 2) * 12 }}>
                <a 
                  href={`#${heading.id}`}
                  className={`block text-sm transition-all ${activeIndex === i ? 'text-[var(--neon-2)] font-medium drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>

      </SiteLayout>

      {/* Global overrides for the prose content */}
      <style dangerouslySetInnerHTML={{__html: `
        .font-sans {
          font-family: var(--font-inter), sans-serif;
        }
        .font-title {
          font-family: var(--font-chakra), sans-serif;
        }
        .prose-content {
          line-height: 1.7;
          font-size: 1.05rem;
        }
        /* Anclas explícitas del markdown (ej: #spotify-obs): sin esto el navbar
           sticky tapa el título al saltar. */
        .prose-content a[id]:empty {
          display: block;
          scroll-margin-top: 100px;
        }
        .prose-content h1, .prose-content h2, .prose-content h3 {
          font-family: var(--font-chakra), sans-serif;
          color: #fff;
          margin-top: 2.5em;
          margin-bottom: 1em;
          scroll-margin-top: 100px;
          line-height: 1.3;
        }
        .prose-content h1 {
          font-size: 2.75rem;
          margin-top: 0;
          font-weight: 700;
          background: linear-gradient(90deg, var(--neon), var(--neon-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .prose-content h2 {
          font-size: 1.75rem;
          font-weight: 600;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
        }
        .prose-content h3 {
          font-size: 1.35rem;
          font-weight: 600;
        }
        .prose-content p, .prose-content ul, .prose-content ol {
          margin-bottom: 1.25em;
        }
        .prose-content ul {
          list-style-type: none;
          padding-left: 0;
        }
        .prose-content ul li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .prose-content ul li::before {
          content: "";
          position: absolute;
          left: 0.5rem;
          top: 0.65rem;
          width: 0.35rem;
          height: 0.35rem;
          background-color: var(--neon);
          border-radius: 50%;
        }
        .prose-content a {
          color: var(--neon-2);
          text-decoration: none;
          transition: all 0.2s;
        }
        .prose-content a:hover {
          color: var(--neon-3);
          text-shadow: 0 0 8px rgba(83, 252, 24, 0.4);
        }
        .prose-content strong {
          color: #fff;
          font-weight: 600;
        }
        .prose-content code:not(.code-wrapper code) {
          font-family: var(--font-mono), monospace;
          background: var(--surface-2);
          padding: 0.2em 0.4em;
          border-radius: 6px;
          font-size: 0.9em;
          color: var(--neon-2);
          border: 1px solid var(--border);
        }
        .code-wrapper {
          box-shadow: inset 0 0 0 1px var(--border);
          margin-bottom: 1.5em;
          background-color: var(--surface-2);
        }
        .code-wrapper code {
          font-family: var(--font-mono), monospace;
          color: #e2e8f0;
        }
        .code-wrapper pre {
          overflow-x: auto;
        }
      `}} />
    </div>
  )
}
