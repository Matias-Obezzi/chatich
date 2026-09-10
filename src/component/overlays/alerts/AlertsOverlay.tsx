'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useStreamEvent } from '@/contexts/streamContext';
import { StreamEvent, EventOf, StreamEventType } from '@/lib/events/types';
import DebugPanel from '../debug/DebugPanel';

type QueueItem = {
    id: string;
    event: StreamEvent;
    groupedCount?: number;
};

export type AlertsConfig = {
    position?: string;
    duration?: number;
    theme?: string;
    accent?: string;
    sound?: boolean;
    events?: StreamEventType[];
};

export default function AlertsOverlay({ config }: { config?: AlertsConfig } = {}) {
    const searchParams = useSearchParams();
    const position = config?.position || searchParams.get('position') || 'top-center';
    const duration = config?.duration !== undefined ? config.duration : parseInt(searchParams.get('duration') || '6000', 10);
    const theme = config?.theme || searchParams.get('theme') || 'dark';
    const accent = config?.accent || searchParams.get('accent');
    const sound = config?.sound !== undefined ? config.sound : (searchParams.get('sound') === '1');
    const eventsFilter = config?.events || (searchParams.get('events')?.split(',').filter(Boolean) as StreamEventType[] | undefined);
    const isDebug = searchParams.get('debug') === '1';

    const [currentAlert, setCurrentAlert] = useState<QueueItem | null>(null);
    const queueRef = useRef<QueueItem[]>([]);
    // Espeja `currentAlert` para que processQueue no dependa del closure del render.
    // Sin esto, enqueue() disparaba processQueue con un currentAlert obsoleto (null)
    // y cada evento nuevo pisaba la alerta que estaba en pantalla en vez de encolarse.
    const showingRef = useRef(false);

    const processQueue = useCallback(() => {
        if (showingRef.current) return;
        const next = queueRef.current.shift();
        if (!next) return;
        showingRef.current = true;
        setCurrentAlert(next);
        if (sound) {
            // TODO: reproducir archivo de audio
        }
    }, [sound]);

    useEffect(() => {
        if (currentAlert) {
            const timer = setTimeout(() => {
                showingRef.current = false;
                setCurrentAlert(null);
            }, duration);
            return () => clearTimeout(timer);
        }
        processQueue();
    }, [currentAlert, duration, processQueue]);

    const enqueue = (item: QueueItem) => {
        if (eventsFilter && eventsFilter.length > 0 && !eventsFilter.includes(item.event.type)) {
            return;
        }
        
        if (queueRef.current.length >= 20) {
            queueRef.current.shift();
        }
        queueRef.current.push(item);
        
        setTimeout(processQueue, 0);
    };

    const giftBombRef = useRef<{ timer: NodeJS.Timeout, username: string, event: EventOf<'sub.gift'>, totalGifts: number } | null>(null);
    
    const flushGiftBomb = () => {
        if (giftBombRef.current) {
            const { event, totalGifts } = giftBombRef.current;
            enqueue({ id: event.id + '-grouped', event, groupedCount: totalGifts });
            giftBombRef.current = null;
        }
    };

    const handleAlertEvent = (e: StreamEvent) => {
        if (e.type === 'sub.gift') {
            const currentBomb = giftBombRef.current;
            if (currentBomb && currentBomb.username === e.actor.username) {
                clearTimeout(currentBomb.timer);
                currentBomb.totalGifts += (e.count || 1);
                currentBomb.timer = setTimeout(flushGiftBomb, 2000);
            } else {
                if (currentBomb) flushGiftBomb();
                giftBombRef.current = {
                    timer: setTimeout(flushGiftBomb, 2000),
                    username: e.actor.username,
                    event: e,
                    totalGifts: e.count || 1
                };
            }
            return;
        }

        enqueue({ id: e.id, event: e });
    };

    useStreamEvent('sub.new', handleAlertEvent);
    useStreamEvent('sub.resub', handleAlertEvent);
    useStreamEvent('sub.gift', handleAlertEvent);
    useStreamEvent('cheer', handleAlertEvent);
    useStreamEvent('raid', handleAlertEvent);
    useStreamEvent('host', handleAlertEvent);
    useStreamEvent('superchat', handleAlertEvent);
    useStreamEvent('member.new', handleAlertEvent);

    const positionClasses: Record<string, string> = {
        'top-left': 'justify-start items-start',
        'top-center': 'justify-center items-start',
        'top-right': 'justify-end items-start',
        'center': 'justify-center items-center',
        'bottom-left': 'justify-start items-end',
        'bottom-center': 'justify-center items-end',
        'bottom-right': 'justify-end items-end',
    };

    return (
        <div className="w-full h-full overflow-hidden pointer-events-none relative flex">
            {isDebug && (
                <div className="absolute top-4 left-4 z-50 pointer-events-auto">
                    <DebugPanel />
                </div>
            )}
            
            <div className={`w-full h-full p-8 flex ${positionClasses[position] || positionClasses['top-center']}`}>
                <AnimatePresence mode="wait" onExitComplete={() => setTimeout(processQueue, 100)}>
                    {currentAlert && (
                        <AlertBox 
                            key={currentAlert.id} 
                            item={currentAlert} 
                            theme={theme} 
                            customAccent={accent} 
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function AlertBox({ item, theme, customAccent }: { item: QueueItem, theme: string, customAccent: string | null }) {
    const { event, groupedCount } = item;
    
    let color = '';
    switch (event.platform) {
        case 'twitch': color = '#9146FF'; break;
        case 'kick': color = '#53FC18'; break;
        case 'youtube': color = '#FF0033'; break;
        default: color = '#ffffff';
    }
    
    if (event.type === 'superchat' && event.tierColor) {
        color = event.tierColor;
    }
    if (customAccent) {
        color = `#${customAccent}`;
    }

    let title = '';
    let subtitle = '';

    switch (event.type) {
        case 'sub.new':
            title = 'New Subscriber!';
            subtitle = `${event.actor.displayName || event.actor.username} just subscribed!`;
            break;
        case 'sub.resub':
            title = 'Resubscription!';
            subtitle = `${event.actor.displayName || event.actor.username} resubscribed for ${event.months || 0} months!`;
            break;
        case 'sub.gift':
            title = 'Gifted Subs!';
            subtitle = `${event.actor.displayName || event.actor.username} gifted ${groupedCount} subs!`;
            break;
        case 'cheer':
            title = 'Cheers!';
            subtitle = `${event.actor.displayName || event.actor.username} cheered ${event.bits} bits!`;
            break;
        case 'raid':
            title = 'Raid!';
            subtitle = `${event.actor.displayName || event.actor.username} is raiding with ${event.viewers} viewers!`;
            break;
        case 'host':
            title = 'Host!';
            subtitle = `${event.actor.displayName || event.actor.username} is hosting with ${event.viewers || 0} viewers!`;
            break;
        case 'superchat':
            title = 'Superchat!';
            subtitle = `${event.actor.displayName || event.actor.username} sent ${event.amount} ${event.currency}!`;
            break;
        case 'member.new':
            title = 'New Member!';
            subtitle = `${event.actor.displayName || event.actor.username} became a member!`;
            break;
    }

    const isDark = theme !== 'light';
    const bgClass = isDark ? 'bg-slate-900/90' : 'bg-white/90';
    const textClass = isDark ? 'text-white' : 'text-slate-900';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9, transition: { duration: 0.3 } }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
            style={{ 
                '--accent': color, 
                borderColor: color, 
                ...(theme === 'neon' ? { boxShadow: `0 0 20px ${color}` } : {}) 
            } as React.CSSProperties}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${bgClass} ${textClass} min-w-[300px]`}
        >
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="w-16 h-16 rounded-full mb-4 flex items-center justify-center text-3xl"
                style={{ backgroundColor: color }}
            >
                🎉
            </motion.div>
            <h2 className="text-2xl font-bold mb-1 text-center" style={{ color: theme === 'light' ? color : 'inherit' }}>
                {title}
            </h2>
            <p className="text-lg text-center opacity-90">
                {subtitle}
            </p>
            {'text' in event && event.text && (
                <p className="mt-4 text-center italic opacity-80 border-t border-current pt-4">
                    &quot;{event.text}&quot;
                </p>
            )}
        </motion.div>
    );
}
