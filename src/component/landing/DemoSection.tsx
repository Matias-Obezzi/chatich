'use client';

import React, { Suspense } from 'react';
import { useStream, StreamProvider } from '@/contexts/streamContext';
import AlertsOverlay from '@/component/overlays/alerts/AlertsOverlay';
import { EventActor, StreamEvent } from '@/lib/events/types';
import { Fx, pixelate } from '@uiness/fx';
import { useTranslations } from './i18n';

function DemoControls({ lang }: { lang: string }) {
    const { bus } = useStream();
    const t = useTranslations(lang);
    
    const createActor = (): EventActor => ({
        username: 'user_' + Math.floor(Math.random() * 1000),
        displayName: 'Demo User',
        color: '#FF5733'
    });

    const fire = (e: Partial<StreamEvent>) => {
        if (!bus) return;
        bus.emit({
            id: crypto.randomUUID(),
            platform: 'twitch',
            channel: 'demo',
            timestamp: Date.now(),
            ...e
        } as StreamEvent);
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-surface-2 rounded-xl border border-border backdrop-blur-md">
            <h4 className="text-sm font-bold text-muted mb-2 font-chakra uppercase">{t.fireEvents}</h4>
            <div className="grid grid-cols-2 gap-2">
                <button className="bg-twitch text-white px-3 py-2 rounded-xl text-sm hover:opacity-90 font-bold" onClick={() => fire({ type: 'sub.new', actor: createActor(), tier: '1' })}>Sub</button>
                <button className="bg-kick text-black px-3 py-2 rounded-xl text-sm hover:opacity-90 font-bold" onClick={() => fire({ type: 'sub.gift', actor: createActor(), count: 1 })}>Gift Sub</button>
                <button className="bg-youtube text-white px-3 py-2 rounded-xl text-sm hover:opacity-90 font-bold" onClick={() => fire({ type: 'superchat', actor: createActor(), amount: 50, currency: 'USD', text: 'Nice stream!', tierColor: '#FFD700' })}>Superchat</button>
                <button className="bg-neon text-black px-3 py-2 rounded-xl text-sm hover:opacity-90 font-bold" onClick={() => fire({ type: 'raid', actor: createActor(), viewers: 125 })}>Raid</button>
            </div>
        </div>
    );
}

export default function DemoSection({ lang }: { lang: string }) {
    const t = useTranslations(lang);
    
    return (
        <section className="py-24 max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <h2 className="font-chakra text-5xl font-bold mb-4">{t.demoTitle}</h2>
                <p className="text-xl text-muted max-w-2xl mx-auto">
                    {t.demoDesc}
                </p>
            </div>
            
            <div className="w-full aspect-video bg-black rounded-radius border-4 border-surface-2 relative overflow-hidden shadow-2xl">
                {/* Simulated OBS Background */}
                <div className="absolute inset-0 z-0">
                    <Fx src="/wave_background.png" effects={[pixelate(4)]} fit="cover" width={1920} height={1080} className="w-full h-full opacity-40" />
                </div>
                
                <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center">Loading Demo...</div>}>
                    <StreamProvider>
                        <div className="absolute inset-0 z-10">
                            <AlertsOverlay />
                        </div>
                        <div className="absolute bottom-6 left-6 z-20 w-72">
                            <DemoControls lang={lang} />
                        </div>
                    </StreamProvider>
                </Suspense>
            </div>
        </section>
    );
}
