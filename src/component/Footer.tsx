'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BrandLogo from './BrandLogo';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer({ lang }: { lang?: string }) {
    const searchParams = useSearchParams();
    
    // Si no viene lang por prop, intentamos leerlo de la URL, por defecto 'en'
    const currentLang = lang || searchParams.get('lang') || 'en';

    return (
        <footer className="bg-surface-2 border-t border-border py-8 text-muted w-full">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Izquierda */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-neon/50 rounded-xl inline-block mb-1">
                        <BrandLogo size={24} showText={true} />
                    </Link>
                    <p className="text-sm">Open source OBS overlays.</p>
                </div>

                {/* Centro */}
                <div className="flex flex-wrap justify-center gap-6 font-bold text-sm">
                    <a href="https://github.com/matias-obezzi/chatich" target="_blank" rel="noreferrer" className="hover:text-neon transition-colors">
                        GitHub
                    </a>
                    <a href="https://github.com/matias-obezzi/chatich/issues" target="_blank" rel="noreferrer" className="hover:text-neon transition-colors">
                        Issues
                    </a>
                    <Link href="/docs" className="hover:text-neon transition-colors">
                        Docs
                    </Link>
                    <Link href="/overlay/chat/builder" className="hover:text-neon transition-colors">
                        Builders
                    </Link>
                </div>

                {/* Derecha */}
                <div className="flex items-center justify-center md:justify-end">
                    <LanguageSwitcher currentLang={currentLang} />
                </div>
                
            </div>
        </footer>
    );
}
