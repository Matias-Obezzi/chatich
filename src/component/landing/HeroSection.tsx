'use client';

import React from 'react';
import Link from 'next/link';
import { Fx, scanlines, chromatic } from '@uiness/fx';
import { useScrollProgress } from '@uiness/scroll';
import { useTranslations } from './i18n';

export default function HeroSection({ lang }: { lang: string }) {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const progress = useScrollProgress(scrollRef, { offset: ['start start', 'end start'] });
    const t = useTranslations(lang);

    return (
        <section ref={scrollRef} className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-bg">
            <div className="absolute inset-0 z-0">
                <Fx 
                    src="/wave_background.png" 
                    effects={[scanlines(), chromatic(2)]} 
                    fit="cover" 
                    width={1920} 
                    height={1080}
                    className="w-full h-full opacity-30" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg"></div>
            </div>
            
            <div 
                className="z-10 text-center flex flex-col items-center px-4 max-w-5xl"
                style={{ 
                    opacity: 1 - (progress * 1.5),
                    transform: `translateY(${progress * 100}px)` 
                }}
            >
                <div className="mb-6 inline-block px-4 py-1 rounded-full border border-border bg-surface text-sm font-bold tracking-widest uppercase text-neon-2">
                    {t.earlyAccess}
                </div>
                
                <h1 className="font-chakra text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-text to-muted relative">
                    <span className="relative z-10">{t.heroTitle}</span>
                    <div className="absolute inset-0 z-0 opacity-50 mix-blend-screen pointer-events-none">
                        {t.heroTitle}
                    </div>
                </h1>
                
                <p className="text-xl md:text-3xl text-muted max-w-3xl text-center mb-10 leading-relaxed">
                    {t.heroTagline} {t.heroDesc}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/overlay/chat/builder"
                        className="bg-neon text-bg px-10 py-4 rounded-xl font-bold hover:bg-neon-2 transition-colors text-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-neon/50"
                    >
                        {t.buildBtn}
                    </Link>
                    <Link
                        href="/docs"
                        className="border border-border bg-surface-2/50 backdrop-blur text-text px-10 py-4 rounded-xl font-bold hover:bg-surface transition-colors text-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-neon/50"
                    >
                        {t.docsBtn}
                    </Link>
                </div>
            </div>
        </section>
    );
}
