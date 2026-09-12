'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { buildAuthorizeUrl, fetchNowPlaying, getClientId, readTokens, type NowPlaying } from '@/lib/spotify';
import { normalizeTheme, themeSurface } from '../ui';

export type MusicConfig = {
    position?: string;
    theme?: string;
    color?: string;
    showArt?: boolean;
    showProgress?: boolean;
    /** Cada cuántos segundos se le pregunta a Spotify. */
    pollSeconds?: number;
    /** Datos falsos para la vista previa del builder, en lugar de pegarle a Spotify. */
    demo?: NowPlaying | null;
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

export default function MusicOverlay({ config }: { config?: MusicConfig } = {}) {
    const searchParams = useSearchParams();

    const position = config?.position || searchParams.get('position') || 'bottom-left';
    const theme = normalizeTheme(config?.theme ?? searchParams.get('theme'));
    const color = config?.color || `#${(searchParams.get('color') || '8B5CF6').replace('#', '')}`;
    const showArt = config?.showArt !== undefined ? config.showArt : searchParams.get('art') !== '0';
    const showProgress =
        config?.showProgress !== undefined ? config.showProgress : searchParams.get('progress') !== '0';
    const pollSeconds =
        config?.pollSeconds !== undefined ? config.pollSeconds : parseInt(searchParams.get('poll') || '8', 10);

    const isDemo = config?.demo !== undefined;

    const [track, setTrack] = useState<NowPlaying | null>(config?.demo ?? null);
    const [needsAuth, setNeedsAuth] = useState(false);
    // Se interpola localmente entre consultas para que la barra no avance a los saltos.
    const lastSyncRef = useRef<{ at: number; progressMs: number } | null>(null);
    const [progressMs, setProgressMs] = useState(config?.demo?.progressMs ?? 0);

    useEffect(() => {
        if (isDemo) {
            setTrack(config?.demo ?? null);
            setProgressMs(config?.demo?.progressMs ?? 0);
        }
    }, [isDemo, config?.demo]);

    const poll = useCallback(async () => {
        if (!readTokens()) {
            setNeedsAuth(true);
            setTrack(null);
            return;
        }
        setNeedsAuth(false);
        const next = await fetchNowPlaying();
        setTrack(next);
        if (next) {
            lastSyncRef.current = { at: Date.now(), progressMs: next.progressMs };
            setProgressMs(next.progressMs);
        }
    }, []);

    useEffect(() => {
        if (isDemo) return;
        void poll();
        const interval = setInterval(() => void poll(), Math.max(3, pollSeconds) * 1000);
        return () => clearInterval(interval);
    }, [isDemo, poll, pollSeconds]);

    // Avance suave de la barra entre consultas.
    useEffect(() => {
        if (isDemo || !track?.isPlaying) return;
        const ticker = setInterval(() => {
            const sync = lastSyncRef.current;
            if (!sync) return;
            setProgressMs(Math.min(track.durationMs, sync.progressMs + (Date.now() - sync.at)));
        }, 500);
        return () => clearInterval(ticker);
    }, [isDemo, track?.isPlaying, track?.durationMs]);

    const connect = async () => {
        try {
            window.location.href = await buildAuthorizeUrl();
        } catch {
            // Sin client id no hay nada que hacer; el cartel de abajo ya lo explica.
        }
    };

    const surface = themeSurface(theme);
    const percent = track && track.durationMs > 0 ? (progressMs / track.durationMs) * 100 : 0;

    return (
        <div
            className={`w-full h-full flex p-8 ${POSITION_CLASS[position] ?? POSITION_CLASS['bottom-left']} ${
                needsAuth ? '' : 'pointer-events-none'
            }`}
        >
            <AnimatePresence mode="wait">
                {needsAuth ? (
                    // Este cartel es la ÚNICA vía de autorización: el token vive en el localStorage
                    // del navegador de OBS, así que hay que tocarlo desde "Interactuar".
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`rounded-2xl p-5 max-w-xs text-text pointer-events-auto ${surface.className}`}
                    >
                        <p className="font-chakra font-bold mb-1">Spotify sin conectar</p>
                        {getClientId() ? (
                            <>
                                <p className="text-xs text-muted mb-3">
                                    Abrí &quot;Interactuar&quot; en la fuente de OBS y tocá el botón. El paso a
                                    paso está en chatich.vercel.app/docs
                                </p>
                                <button
                                    type="button"
                                    onClick={connect}
                                    className="w-full py-2 rounded-xl font-bold text-bg"
                                    style={{ backgroundColor: color }}
                                >
                                    Conectar con Spotify
                                </button>
                            </>
                        ) : (
                            <p className="text-xs text-muted">
                                Falta configurar NEXT_PUBLIC_SPOTIFY_CLIENT_ID en el servidor.
                            </p>
                        )}
                    </motion.div>
                ) : track ? (
                    <motion.div
                        key={track.title + track.artists}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.25 } }}
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                        className={`rounded-2xl p-3 pr-5 flex items-center gap-3 max-w-sm text-text ${surface.className}`}
                    >
                        {showArt && track.albumArt && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={track.albumArt}
                                alt=""
                                className="w-14 h-14 rounded-lg object-cover shrink-0"
                            />
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{track.title}</p>
                            <p className="text-xs text-muted truncate">{track.artists}</p>
                            {showProgress && (
                                <div className="h-1 rounded-full bg-bg-2 overflow-hidden mt-2">
                                    <div
                                        className="h-full rounded-full transition-[width] duration-500 ease-linear"
                                        style={{ width: `${percent}%`, backgroundColor: color }}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
