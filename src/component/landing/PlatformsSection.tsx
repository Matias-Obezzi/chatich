'use client';

import React from 'react';
import { Reveal } from '@/component/ui/reveal';
import { useTranslations } from './i18n';

import { Image } from '@uiness/image';

export default function PlatformsSection({ lang }: { lang: string }) {
    const t = useTranslations(lang);
    return (
        <section className="py-24 bg-surface-2 border-y border-border">
            <div className="max-w-6xl mx-auto px-4">
                <Reveal className="text-center mb-16">
                    <h2 className="font-chakra text-4xl md:text-5xl font-bold mb-4">{t.platformsTitle}</h2>
                    <p className="text-xl text-muted">{t.platformsDesc}</p>
                </Reveal>
                
                <Reveal stagger={120} className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                </Reveal>
            </div>
        </section>
    );
}

/**
 * Ojo con `className`, `style` y el resto de props: cuando esta tarjeta va dentro de un
 * <Reveal stagger>, el Reveal clona cada hijo inyectándole `data-state` y las clases del
 * estado oculto. Si no se reenvían al div raíz, la tarjeta aparece sin animarse.
 */
function PlatformCard({
    name,
    color,
    icon,
    description,
    className,
    ...props
}: {
    name: string;
    color: string;
    icon: string;
    description: string;
} & React.ComponentProps<'div'>) {
    return (
        <div
            {...props}
            className={`bg-bg p-8 rounded-radius border border-border flex flex-col items-center text-center hover:border-muted transition-colors relative overflow-hidden group ${className ?? ''}`}
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
