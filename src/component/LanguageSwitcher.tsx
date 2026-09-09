'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getHref = (lang: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('lang', lang);
        return `${pathname}?${params.toString()}`;
    };

    const langs = ['en', 'es', 'pt'];

    return (
        <nav aria-label="Language selector" className="flex gap-4">
            {langs.map((lang) => {
                const isActive = currentLang === lang;
                return (
                    <Link
                        key={lang}
                        href={getHref(lang)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`text-sm transition-colors ${
                            isActive
                                ? 'text-[var(--neon)] font-bold'
                                : 'text-[var(--muted)] hover:text-[var(--text)]'
                        }`}
                    >
                        {lang.toUpperCase()}
                    </Link>
                );
            })}
        </nav>
    );
}
