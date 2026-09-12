'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BackgroundTextRows } from '@/component/screens/bgText';
import Waves from '@/component/screens/wavy';

export const MIDDLE_TEXT_MAX = 24;
export const BACKGROUND_TEXT_MAX = 40;

export type ScreenConfig = {
    middleText?: string;
    /** Tamaño del texto central en vw. */
    middleSize?: number;
    textColor?: string;
    bgColor?: string;
    backgroundText?: string;
    bgTextColor?: string;
    bgTextSpeed?: number;
    bgTextRows?: number;
    /** 'none' | 'image' | 'interactive' */
    backgroundType?: string;
    /** Minutos de cuenta regresiva; 0 la desactiva. Arranca cuando carga la fuente. */
    countdownMinutes?: number;
};

function formatCountdown(totalSeconds: number): string {
    const safe = Math.max(0, totalSeconds);
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function ScreenOverlay({ config }: { config?: ScreenConfig } = {}) {
    const searchParams = useSearchParams();

    const read = (key: string) => searchParams.get(key);
    const readNumber = (key: string, fallback: number) => {
        const raw = searchParams.get(key);
        const parsed = raw === null ? NaN : Number(raw);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const middleText = useMemo(
        () => (config?.middleText ?? read('middleText') ?? '').slice(0, MIDDLE_TEXT_MAX),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [config?.middleText, searchParams]
    );
    const backgroundText = useMemo(
        () => (config?.backgroundText ?? read('backgroundText') ?? '').slice(0, BACKGROUND_TEXT_MAX),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [config?.backgroundText, searchParams]
    );

    const middleSize = config?.middleSize ?? readNumber('middleSize', 12);
    const textColor = config?.textColor ?? `#${(read('textColor') || 'FFFFFF').replace('#', '')}`;
    const bgColor = config?.bgColor ?? `#${(read('bgColor') || '000000').replace('#', '')}`;
    const bgTextColor = config?.bgTextColor ?? `#${(read('bgTextColor') || 'FFFFFF').replace('#', '')}`;
    const bgTextSpeed = config?.bgTextSpeed ?? readNumber('bgTextSpeed', 18);
    const bgTextRows = config?.bgTextRows ?? readNumber('bgTextRows', 20);
    const backgroundType = config?.backgroundType ?? read('backgroundType') ?? 'image';
    const countdownMinutes = config?.countdownMinutes ?? readNumber('countdown', 0);

    // La cuenta regresiva arranca cuando se monta la fuente, que es cuando el streamer
    // pone la escena: no hace falta una hora absoluta en la URL.
    const [remaining, setRemaining] = useState(() => Math.round(countdownMinutes * 60));

    useEffect(() => {
        setRemaining(Math.round(countdownMinutes * 60));
        if (countdownMinutes <= 0) return;
        const timer = setInterval(() => setRemaining((value) => (value > 0 ? value - 1 : 0)), 1000);
        return () => clearInterval(timer);
    }, [countdownMinutes]);

    return (
        <div
            className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden gap-4"
            style={{ backgroundColor: bgColor }}
        >
            {backgroundType === 'interactive' && (
                <Waves lineColor="rgba(255,255,255,.2)" className="z-0 [&_*]:z-0 opacity-20" />
            )}
            {backgroundType === 'image' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src="/wave_background.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-20"
                />
            )}

            {backgroundText && (
                <BackgroundTextRows
                    rows={bgTextRows}
                    text={backgroundText}
                    color={bgTextColor}
                    durationSeconds={bgTextSpeed}
                    className="z-10"
                />
            )}

            {middleText && (
                <div
                    className="font-extrabold z-20 pointer-events-none text-center leading-none px-8 break-words max-w-full"
                    style={{ fontSize: `${middleSize}vw`, color: textColor }}
                >
                    {middleText}
                </div>
            )}

            {countdownMinutes > 0 && (
                <div
                    className="font-mono font-bold z-20 pointer-events-none tabular-nums"
                    style={{ fontSize: `${Math.max(2, middleSize * 0.45)}vw`, color: textColor, opacity: 0.8 }}
                >
                    {formatCountdown(remaining)}
                </div>
            )}
        </div>
    );
}
