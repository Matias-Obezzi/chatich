'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useStreamEvent } from '@/contexts/streamContext';
import type { EventOf, Platform } from '@/lib/events/types';
import { normalizeTheme, themeSurface } from '../ui';

export type StatusConfig = {
    position?: string;
    theme?: string;
    orientation?: 'horizontal' | 'vertical';
    showUptime?: boolean;
    hideOffline?: boolean;
};

const POSITION_CLASS: Record<string, string> = {
    'top-left': 'items-start justify-start',
    'top-center': 'items-start justify-center',
    'top-right': 'items-start justify-end',
    center: 'items-center justify-center',
    'bottom-left': 'items-end justify-start',
    'bottom-center': 'items-end justify-center',
    'bottom-right': 'items-end justify-end',
};

const PLATFORMS: Array<{ id: Platform; label: string; dotClass: string }> = [
    { id: 'twitch', label: 'Twitch', dotClass: 'bg-twitch' },
    { id: 'kick', label: 'Kick', dotClass: 'bg-kick' },
    { id: 'youtube', label: 'YouTube', dotClass: 'bg-youtube' },
];

/** `connectedAt` en epoch ms; null significa desconectada. */
type Connections = Partial<Record<Platform, number | null>>;

function formatUptime(since: number, now: number): string {
    const total = Math.max(0, Math.floor((now - since) / 1000));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const pad = (value: number) => String(value).padStart(2, '0');
    return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export default function StatusOverlay({ config }: { config?: StatusConfig } = {}) {
    const searchParams = useSearchParams();

    const position = config?.position || searchParams.get('position') || 'top-left';
    const theme = normalizeTheme(config?.theme ?? searchParams.get('theme'));
    const orientation =
        config?.orientation || (searchParams.get('orientation') === 'vertical' ? 'vertical' : 'horizontal');
    const showUptime =
        config?.showUptime !== undefined ? config.showUptime : searchParams.get('uptime') !== '0';
    const hideOffline =
        config?.hideOffline !== undefined ? config.hideOffline : searchParams.get('hideOffline') === '1';

    const [connections, setConnections] = useState<Connections>({});
    const [now, setNow] = useState(() => Date.now());

    useStreamEvent(
        'stream.connected',
        useCallback((event: EventOf<'stream.connected'>) => {
            setConnections((current) => ({ ...current, [event.platform]: event.timestamp || Date.now() }));
        }, [])
    );

    useStreamEvent(
        'stream.disconnected',
        useCallback((event: EventOf<'stream.disconnected'>) => {
            setConnections((current) => ({ ...current, [event.platform]: null }));
        }, [])
    );

    // Un solo intervalo para todos los chips; solo corre si hay algo conectado que contar.
    const hasLiveUptime = showUptime && PLATFORMS.some((platform) => connections[platform.id]);
    useEffect(() => {
        if (!hasLiveUptime) return;
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, [hasLiveUptime]);

    const surface = themeSurface(theme);
    const visible = PLATFORMS.filter((platform) => {
        const state = connections[platform.id];
        if (state === undefined) return !hideOffline; // nunca reportó nada
        if (state === null) return !hideOffline;
        return true;
    });

    return (
        <div
            className={`w-full h-full flex p-8 pointer-events-none ${
                POSITION_CLASS[position] ?? POSITION_CLASS['top-left']
            }`}
        >
            <div className={`flex gap-2 ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}`}>
                <AnimatePresence initial={false}>
                    {visible.map((platform) => {
                        const connectedAt = connections[platform.id];
                        const isOnline = typeof connectedAt === 'number';

                        return (
                            <motion.div
                                key={platform.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-text ${surface.className}`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${platform.dotClass} ${
                                        isOnline ? '' : 'opacity-30'
                                    }`}
                                    aria-hidden="true"
                                />
                                <span className={`text-sm font-semibold ${isOnline ? '' : 'text-muted'}`}>
                                    {platform.label}
                                </span>
                                {isOnline ? (
                                    showUptime && (
                                        <span className="text-xs font-mono tabular-nums text-muted">
                                            {formatUptime(connectedAt, now)}
                                        </span>
                                    )
                                ) : (
                                    <span className="text-xs text-muted">sin conexión</span>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
