'use client';

import React, { useRef } from 'react';
import { useScrollProgress } from '@uiness/scroll';
import { useTranslations } from './i18n';

import { Image } from '@uiness/image';

export default function PlatformsSection({ lang }: { lang: string }) {
    const t = useTranslations(lang);
    return (
        <section className="py-24 bg-surface-2 border-y border-border">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-chakra text-4xl md:text-5xl font-bold mb-4">{t.platformsTitle}</h2>
                    <p className="text-xl text-muted">{t.platformsDesc}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PlatformCard 
                        name="Twitch" 
                        color="bg-twitch" 
                        icon="/twitch.png" 
                        description={t.twitchDesc}
                    />
                    <PlatformCard 
                        name="Kick" 
                        color="bg-kick" 
                        icon="/kick.ico" 
                        description={t.kickDesc}
                    />
                    <PlatformCard 
                        name="YouTube" 
                        color="bg-youtube" 
                        icon="/youtube.png" 
                        description={t.youtubeDesc}
                    />
                </div>
            </div>
        </section>
    );
}

function PlatformCard({ name, color, icon, description }: { name: string, color: string, icon: string, description: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const progress = useScrollProgress(ref, { offset: ['start end', 'center center'] });
    
    return (
        <div 
            ref={ref}
            style={{ 
                opacity: progress,
                transform: `translateY(${(1 - progress) * 50}px)`
            }}
            className="bg-bg p-8 rounded-radius border border-border flex flex-col items-center text-center hover:border-muted transition-colors relative overflow-hidden group"
        >
            <div className={`absolute top-0 left-0 w-full h-1 ${color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            <div className={`w-20 h-20 rounded-full bg-surface-2 mb-6 p-4 border border-border shadow-lg flex items-center justify-center`}>
                <Image src={icon} alt={name} variant="reveal" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <h3 className="font-chakra text-3xl font-bold mb-4">{name}</h3>
            <p className="text-muted leading-relaxed">{description}</p>
        </div>
    );
}
