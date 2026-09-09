'use client';

import React from 'react';
import { useTranslations } from './i18n';

export default function StepsSection({ lang }: { lang: string }) {
    const t = useTranslations(lang);
    return (
        <section className="py-24 bg-bg border-b border-border">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-chakra text-4xl md:text-5xl font-bold mb-4">{t.stepsTitle}</h2>
                    <p className="text-xl text-muted">{t.stepsDesc}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-surface-2 z-0"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-2 border-4 border-bg flex items-center justify-center text-4xl font-chakra font-bold text-neon mb-6 shadow-xl">
                            1
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-chakra">{t.step1Title}</h3>
                        <p className="text-muted">{t.step1Desc}</p>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-2 border-4 border-bg flex items-center justify-center text-4xl font-chakra font-bold text-neon-2 mb-6 shadow-xl">
                            2
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-chakra">{t.step2Title}</h3>
                        <p className="text-muted">{t.step2Desc}</p>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-2 border-4 border-bg flex items-center justify-center text-4xl font-chakra font-bold text-neon-3 mb-6 shadow-xl">
                            3
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-chakra">{t.step3Title}</h3>
                        <p className="text-muted">{t.step3Desc}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
