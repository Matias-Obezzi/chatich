'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useStream, StreamProvider } from '@/contexts/streamContext';
import AlertsOverlay from '@/component/overlays/alerts/AlertsOverlay';
import GoalsOverlay from '@/component/overlays/goals/GoalsOverlay';
import { Message } from '@/component/chat/message';
import { Reveal } from '@/component/ui/reveal';
import { EventActor, StreamEvent, Platform } from '@/lib/events/types';
import { useTranslations } from './i18n';

/**
 * Tamaño lógico de la escena. Coincide con el ancho que tiene el recuadro en desktop, así
 * que ahí la escala es 1 y no cambia nada; en pantallas más chicas se achica proporcional.
 */
const SCENE_WIDTH = 1120;
const SCENE_HEIGHT = 630;

/**
 * Escala la escena para que entre en el recuadro, midiendo con ResizeObserver.
 * No se puede hacer solo con CSS: `scale()` necesita un número sin unidad y `calc()` no
 * puede producirlo dividiendo una longitud como `100cqw`.
 */
function useScaleToFit(sceneWidth: number) {
    const [scale, setScale] = useState(1);
    const observerRef = useRef<ResizeObserver | null>(null);

    // Callback ref y no useRef + useEffect: el recuadro vive dentro de un <Suspense>, así que
    // en el primer efecto todavía no está montado y un observer enganchado ahí nunca vería nada.
    const ref = useCallback(
        (node: HTMLDivElement | null) => {
            observerRef.current?.disconnect();
            if (!node) return;
            const observer = new ResizeObserver(([entry]) => {
                setScale(entry.contentRect.width / sceneWidth);
            });
            observer.observe(node);
            observerRef.current = observer;
        },
        [sceneWidth]
    );

    useEffect(() => () => observerRef.current?.disconnect(), []);

    return { ref, scale };
}

const DEMO_USERS: Array<{ platform: Platform; actor: EventActor; text: string }> = [
    { platform: 'twitch', actor: { username: 'lucia', displayName: 'lucia', color: '#9146FF' }, text: '¡esto se ve buenísimo!' },
    { platform: 'kick', actor: { username: 'seba', displayName: 'seba', color: '#53FC18' }, text: 'todo el chat en un solo lugar 👀' },
    { platform: 'youtube', actor: { username: 'nico', displayName: 'nico', color: '#FF0033' }, text: 'y no hay que instalar nada?' },
    { platform: 'twitch', actor: { username: 'flor', displayName: 'flor', color: '#22D3EE' }, text: 'ya lo estoy usando' },
    { platform: 'kick', actor: { username: 'martu', displayName: 'martu', color: '#8B5CF6' }, text: 'GG' },
];

/** Chat en vivo de la demo, alimentado por el mismo bus que el resto de los overlays. */
function DemoChat() {
    const { messages } = useStream();
    return (
        <div className="absolute bottom-8 left-8 z-10 flex flex-col gap-2 w-80 pointer-events-none">
            {messages.slice(-3).map((message) => (
                <Message key={message.id} message={message} styles={{}} layout="vertical" theme="glass" />
            ))}
        </div>
    );
}

function DemoControls({ lang }: { lang: string }) {
    const { bus } = useStream();
    const t = useTranslations(lang);
    const messageIndex = useRef(0);

    const fire = useCallback(
        (event: Partial<StreamEvent>, platform: Platform = 'twitch') => {
            if (!bus) return;
            bus.emit({
                id: crypto.randomUUID(),
                platform,
                channel: 'demo',
                timestamp: Date.now(),
                ...event,
            } as StreamEvent);
        },
        [bus]
    );

    const sendMessage = useCallback(() => {
        const next = DEMO_USERS[messageIndex.current % DEMO_USERS.length];
        messageIndex.current += 1;
        fire({ type: 'chat.message', actor: next.actor, text: next.text }, next.platform);
    }, [fire]);

    useEffect(() => {
        // Tres mensajes de entrada para que la escena no arranque vacía, y después un goteo.
        sendMessage();
        const seed = [600, 1200].map((delay) => setTimeout(sendMessage, delay));
        const timer = setInterval(sendMessage, 3200);
        return () => {
            seed.forEach(clearTimeout);
            clearInterval(timer);
        };
    }, [sendMessage]);

    const buttons = [
        { label: 'Mensaje', className: 'bg-surface-2 text-text border border-border', onClick: sendMessage },
        {
            label: 'Sub',
            className: 'bg-twitch text-white',
            onClick: () => fire({ type: 'sub.new', actor: { username: 'lucia', displayName: 'lucia' }, tier: '1' }),
        },
        {
            label: 'Raid',
            className: 'bg-neon text-bg',
            onClick: () => fire({ type: 'raid', actor: { username: 'bigstreamer', displayName: 'BigStreamer' }, viewers: 125 }),
        },
        {
            label: 'Superchat',
            className: 'bg-youtube text-white',
            onClick: () =>
                fire(
                    { type: 'superchat', actor: { username: 'nico', displayName: 'nico' }, amount: 50, currency: 'USD', text: '¡grande!' },
                    'youtube'
                ),
        },
        {
            label: 'Bits',
            className: 'bg-neon-2 text-bg',
            onClick: () => fire({ type: 'cheer', actor: { username: 'flor', displayName: 'flor' }, bits: 500 }),
        },
    ];

    return (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <h4 className="text-[11px] font-bold text-muted font-chakra uppercase tracking-wider w-full text-center sm:w-auto sm:text-left">
                {t.fireEvents}
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
                {buttons.map((button) => (
                    <button
                        key={button.label}
                        type="button"
                        onClick={button.onClick}
                        className={`px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-neon/50 ${button.className}`}
                    >
                        {button.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function DemoSection({ lang }: { lang: string }) {
    const t = useTranslations(lang);
    const { ref: sceneRef, scale } = useScaleToFit(SCENE_WIDTH);

    return (
        // El <main> del sitio es un flex column: con `mx-auto` sobre el propio <section>,
        // los márgenes automáticos anulan el stretch y la sección se encoge al ancho de su
        // contenido. Por eso el límite va en un div interno, como en el resto de las secciones.
        <section className="py-24 w-full relative z-10">
            <div className="max-w-6xl mx-auto px-4">
            <Reveal className="text-center mb-14">
                <h2 className="font-chakra text-4xl md:text-5xl font-bold mb-4">{t.demoTitle}</h2>
                <p className="text-xl text-muted max-w-2xl mx-auto">{t.demoDesc}</p>
            </Reveal>

            <Reveal variant="scale">
                <Suspense fallback={<div className="w-full aspect-video flex items-center justify-center text-muted">Cargando demo...</div>}>
                    <StreamProvider>
                        <div
                            ref={sceneRef}
                            className="w-full aspect-video bg-black rounded-radius border-4 border-surface-2 relative overflow-hidden shadow-2xl"
                        >
                            {/* Lienzo de la escena: degradado limpio más una grilla tenue.
                                Antes era una foto con pixelate, que en pantallas grandes
                                generaba un patrón de muaré bastante feo. */}
                            <div
                                className="absolute inset-0 z-0"
                                style={{ background: 'radial-gradient(ellipse at 50% 0%, #16162a 0%, #08080f 70%)' }}
                            />
                            <div
                                className="absolute inset-0 z-0 opacity-[0.06]"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                                    backgroundSize: '48px 48px',
                                }}
                            />

                            {/* La escena se arma a tamaño fijo y se escala entera, para que las
                                proporciones entre overlays sean siempre las mismas. */}
                            <div
                                className="absolute top-0 left-0 z-10 origin-top-left"
                                style={{ width: SCENE_WIDTH, height: SCENE_HEIGHT, transform: `scale(${scale})` }}
                            >
                                <div className="absolute inset-0">
                                    <AlertsOverlay config={{ position: 'top-center', duration: 5000, theme: 'glass' }} />
                                </div>
                                <div className="absolute bottom-8 right-8 w-64">
                                    {/* Título corto: con el ancho acotado, "Meta de subs" partía en tres líneas. */}
                                    <GoalsOverlay config={{ type: 'subs', title: 'Subs', target: 50, current: 32, theme: 'glass', color: '#8B5CF6' }} />
                                </div>
                                <DemoChat />
                            </div>
                        </div>
                        <DemoControls lang={lang} />
                    </StreamProvider>
                </Suspense>
                </Reveal>
            </div>
        </section>
    );
}
