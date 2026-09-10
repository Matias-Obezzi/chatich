'use client';

import React, { useState } from 'react';
import { toast } from '@uiness/toast';
import { Island, createIsland } from '@uiness/island';
import { useTranslations } from './i18n';
import { useChannels } from '@/lib/useChannels';

export const copyIslandStore = createIsland();

export default function UrlBuilder({ lang }: { lang: string }) {
    const t = useTranslations(lang);
    const { channels, updateChannels, appendChannelParams } = useChannels();
    const [overlayType, setOverlayType] = useState('chat');
        const { twitch, kick, youtube } = channels;

    const buildUrl = () => {
        let url = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        url += `/overlay/${overlayType}?`;
        if (channels.twitch) url += `twitch=${channels.twitch}&`;
        if (channels.kick) url += `kick=${channels.kick}&`;
        if (channels.youtube) url += `youtube=${channels.youtube}&`;
        return url.replace(/&$/, '').replace(/\?$/, '');
    };

    const copyUrl = async () => {
        if (!channels.twitch && !channels.kick && !channels.youtube) {
            toast.error(t.copyEmpty);
            return;
        }
        const url = buildUrl();
        await navigator.clipboard.writeText(url);

        copyIslandStore.show({
            content: (
                <div className="flex items-center gap-2 px-2">
                    <span className="text-neon">✓</span>
                    <span className="font-bold">{t.copied}</span>
                </div>
            ),
            duration: 2000
        });
    };

    return (
        <section id="builder" className="py-24 bg-surface relative">
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="font-chakra text-5xl font-bold mb-4">{t.buildTitle}</h2>
                    <p className="text-xl text-muted">{t.buildDesc}</p>
                </div>
                
                <div className="bg-surface-2 p-8 md:p-12 rounded-[24px] border border-border shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-twitch via-kick to-youtube"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-6 font-chakra flex items-center gap-2">
                                <span className="bg-surface w-8 h-8 rounded-full flex items-center justify-center text-sm border border-border">1</span>
                                {t.channels}
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-muted mb-2 font-bold uppercase tracking-wider">
                                        <div className="w-3 h-3 rounded-full bg-twitch"></div> Twitch
                                    </label>
                                    <input type="text" className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:border-twitch outline-none transition-colors" placeholder="e.g. forsen" value={channels.twitch} onChange={e => updateChannels({twitch: e.target.value})} />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-muted mb-2 font-bold uppercase tracking-wider">
                                        <div className="w-3 h-3 rounded-full bg-kick"></div> Kick
                                    </label>
                                    <input type="text" className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:border-kick outline-none transition-colors" placeholder="e.g. xqc" value={channels.kick} onChange={e => updateChannels({kick: e.target.value})} />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-muted mb-2 font-bold uppercase tracking-wider">
                                        <div className="w-3 h-3 rounded-full bg-youtube"></div> YouTube (ID)
                                    </label>
                                    <input type="text" className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:border-youtube outline-none transition-colors" placeholder="e.g. UCX6OQ3DkcsbYNE6H8uQQuVA" value={channels.youtube} onChange={e => updateChannels({youtube: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-6 font-chakra flex items-center gap-2">
                                <span className="bg-surface w-8 h-8 rounded-full flex items-center justify-center text-sm border border-border">2</span>
                                {t.overlayType}
                            </h3>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${overlayType === 'chat' ? 'border-neon bg-bg' : 'border-border bg-surface'}`}>
                                    <input type="radio" name="overlayType" value="chat" checked={overlayType === 'chat'} onChange={() => setOverlayType('chat')} className="w-5 h-5 accent-neon" />
                                    <div>
                                        <div className="font-bold">{t.combinedChat}</div>
                                        <div className="text-sm text-muted">{t.combinedChatDesc}</div>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${overlayType === 'alerts' ? 'border-neon bg-bg' : 'border-border bg-surface'}`}>
                                    <input type="radio" name="overlayType" value="alerts" checked={overlayType === 'alerts'} onChange={() => setOverlayType('alerts')} className="w-5 h-5 accent-neon" />
                                    <div>
                                        <div className="font-bold">{t.liveAlerts}</div>
                                        <div className="text-sm text-muted">{t.liveAlertsDesc}</div>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${overlayType === 'goals' ? 'border-neon bg-bg' : 'border-border bg-surface'}`}>
                                    <input type="radio" name="overlayType" value="goals" checked={overlayType === 'goals'} onChange={() => setOverlayType('goals')} className="w-5 h-5 accent-neon" />
                                    <div>
                                        <div className="font-bold">{t.liveGoals}</div>
                                        <div className="text-sm text-muted">{t.liveGoalsDesc}</div>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${overlayType === 'emotes' ? 'border-neon bg-bg' : 'border-border bg-surface'}`}>
                                    <input type="radio" name="overlayType" value="emotes" checked={overlayType === 'emotes'} onChange={() => setOverlayType('emotes')} className="w-5 h-5 accent-neon" />
                                    <div>
                                        <div className="font-bold">{t.emoteRain}</div>
                                        <div className="text-sm text-muted">{t.emoteRainDesc}</div>
                                    </div>
                                </label>
                            </div>
                            
                            <h3 className="text-2xl font-bold mt-10 mb-6 font-chakra flex items-center gap-2">
                                <span className="bg-surface w-8 h-8 rounded-full flex items-center justify-center text-sm border border-border">3</span>
                                {t.yourUrl}
                            </h3>
                            <div className="bg-bg border border-border p-5 rounded-lg font-mono text-sm break-all text-neon-2 mb-4 h-24 overflow-y-auto">
                                {buildUrl()}
                            </div>
                            <div className="flex flex-col gap-3">
                                <button onClick={copyUrl} className="w-full bg-text text-bg font-bold py-4 rounded-lg hover:bg-white transition-transform active:scale-95 text-lg">
                                    {t.copyBtn}
                                </button>
                                <a href={`/overlay/${overlayType}/builder`} className="w-full bg-surface-2 border-2 border-neon text-neon text-center font-bold py-4 rounded-lg hover:bg-neon hover:text-bg transition-colors active:scale-95 text-lg flex items-center justify-center gap-2">
                                    <span className="text-xl">✨</span> {t.openBuilder}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Island store={copyIslandStore} position="top" idle={false} />
        </section>
    );
}
