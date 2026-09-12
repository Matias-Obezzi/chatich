'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useStreamEvent } from '@/contexts/streamContext';
import type { EventOf, PollOption } from '@/lib/events/types';
import { normalizeTheme, themeSurface } from '../ui';

export type PollsConfig = {
    position?: string;
    theme?: string;
    color?: string;
    /** Segundos que la encuesta sigue visible después de terminar. */
    lingerSeconds?: number;
    showPercent?: boolean;
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

type ActivePoll = {
    pollId: string;
    title: string;
    options: PollOption[];
    /** Se marca al recibir poll.end para destacar la ganadora. */
    ended: boolean;
};

export default function PollsOverlay({ config }: { config?: PollsConfig } = {}) {
    const searchParams = useSearchParams();

    const position = config?.position || searchParams.get('position') || 'top-center';
    const theme = normalizeTheme(config?.theme ?? searchParams.get('theme'));
    const color = config?.color || `#${(searchParams.get('color') || '8B5CF6').replace('#', '')}`;
    const lingerSeconds =
        config?.lingerSeconds !== undefined
            ? config.lingerSeconds
            : parseInt(searchParams.get('linger') || '8', 10);
    const showPercent =
        config?.showPercent !== undefined ? config.showPercent : searchParams.get('percent') !== '0';

    const [poll, setPoll] = useState<ActivePoll | null>(null);

    useStreamEvent(
        'poll.update',
        useCallback((event: EventOf<'poll.update'>) => {
            setPoll({
                pollId: event.pollId,
                title: event.title,
                options: event.options,
                ended: false,
            });
        }, [])
    );

    useStreamEvent(
        'poll.end',
        useCallback((event: EventOf<'poll.end'>) => {
            // Solo cierra la encuesta que está en pantalla: un poll.end de otra se ignora.
            setPoll((current) =>
                current && current.pollId === event.pollId ? { ...current, ended: true } : current
            );
        }, [])
    );

    // Al terminar, la encuesta queda unos segundos más para que se vea el resultado.
    useEffect(() => {
        if (!poll?.ended) return;
        const timer = setTimeout(() => setPoll(null), Math.max(0, lingerSeconds) * 1000);
        return () => clearTimeout(timer);
    }, [poll?.ended, poll?.pollId, lingerSeconds]);

    const totalVotes = useMemo(
        () => (poll ? poll.options.reduce((sum, option) => sum + option.votes, 0) : 0),
        [poll]
    );

    const winningVotes = useMemo(
        () => (poll ? Math.max(...poll.options.map((option) => option.votes), 0) : 0),
        [poll]
    );

    const surface = themeSurface(theme);

    return (
        <div
            className={`w-full h-full flex p-8 pointer-events-none ${
                POSITION_CLASS[position] ?? POSITION_CLASS['top-center']
            }`}
        >
            <AnimatePresence>
                {poll && (
                    <motion.div
                        key={poll.pollId}
                        initial={{ opacity: 0, y: -20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                        className={`rounded-2xl p-6 min-w-[320px] max-w-[480px] text-text ${surface.className}`}
                    >
                        <h2 className="font-chakra text-xl font-bold mb-4">{poll.title}</h2>

                        <div className="space-y-3">
                            {poll.options.map((option) => {
                                // Sin votos todavía, las barras arrancan vacías en vez de repartirse.
                                const percent = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                const isWinner = poll.ended && option.votes === winningVotes && totalVotes > 0;

                                return (
                                    <div key={option.id}>
                                        <div className="flex items-baseline justify-between gap-3 mb-1">
                                            <span
                                                className={`text-sm truncate ${
                                                    isWinner ? 'font-bold text-text' : 'text-text/90'
                                                }`}
                                            >
                                                {isWinner && '★ '}
                                                {option.label}
                                            </span>
                                            <span className="text-xs font-mono tabular-nums text-muted shrink-0">
                                                {option.votes}
                                                {showPercent && ` · ${Math.round(percent)}%`}
                                            </span>
                                        </div>
                                        <div className="h-2.5 rounded-full bg-bg-2 overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: color, opacity: isWinner || !poll.ended ? 1 : 0.4 }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-xs text-muted mt-4">
                            {totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}
                            {poll.ended && ' · finalizada'}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
