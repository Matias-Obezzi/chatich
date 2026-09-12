'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/component/ui/reveal';
import { useTranslations } from './i18n';

export default function CtaSection({ lang }: { lang: string }) {
    const t = useTranslations(lang);

    return (
        <section className="py-28 bg-surface-2 border-t border-border">
            <Reveal className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="font-chakra text-4xl md:text-5xl font-bold mb-4">{t.ctaTitle}</h2>
                <p className="text-xl text-muted mb-10">{t.ctaDesc}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/overlay/chat/builder"
                        className="group bg-neon text-bg px-10 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity text-lg inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-neon/50"
                    >
                        {t.ctaButton}
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                    <Link
                        href="/docs"
                        className="border border-border bg-surface text-text px-10 py-4 rounded-xl font-bold hover:bg-bg-2 transition-colors text-lg inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-neon/50"
                    >
                        {t.docsBtn}
                    </Link>
                </div>

                <p className="text-sm text-muted mt-8">{t.ctaFootnote}</p>
            </Reveal>
        </section>
    );
}
