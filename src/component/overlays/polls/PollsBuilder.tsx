'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useStream } from '@/contexts/streamContext';
import { useChannels } from '@/lib/useChannels';
import type { PollOption } from '@/lib/events/types';
import PollsOverlay from './PollsOverlay';
import {
    BuilderShell,
    ChannelInputs,
    ColorField,
    OptionCards,
    OVERLAY_THEME_OPTIONS,
    PreviewButton,
    Section,
    SliderField,
    ToggleField,
    useOrigin,
} from '../ui';

const POSITION_OPTIONS = [
    { value: 'top-left', label: '↖ Arriba izq.' },
    { value: 'top-center', label: '↑ Arriba' },
    { value: 'top-right', label: '↗ Arriba der.' },
    { value: 'bottom-left', label: '↙ Abajo izq.' },
    { value: 'bottom-center', label: '↓ Abajo' },
    { value: 'bottom-right', label: '↘ Abajo der.' },
    { value: 'center', label: '· Centro' },
];

const DEMO_OPTIONS: PollOption[] = [
    { id: 1, label: 'Seguimos con este juego', votes: 0 },
    { id: 2, label: 'Cambiamos de juego', votes: 0 },
    { id: 3, label: 'Charla y chat', votes: 0 },
];

export default function PollsBuilder() {
    const { appendChannelParams } = useChannels();
    const { bus } = useStream();
    const origin = useOrigin();

    const [position, setPosition] = useState('top-center');
    const [theme, setTheme] = useState('glass');
    const [color, setColor] = useState('#8B5CF6');
    const [lingerSeconds, setLingerSeconds] = useState(8);
    const [showPercent, setShowPercent] = useState(true);

    // La encuesta simulada vive en un ref para que los botones sumen votos sobre lo ya emitido.
    const demoRef = useRef<{ pollId: string; options: PollOption[] }>({
        pollId: 'demo',
        options: DEMO_OPTIONS.map((option) => ({ ...option })),
    });

    const url = useMemo(() => {
        if (!origin) return '';
        let target = new URL(`${origin}/overlay/polls`);
        target = appendChannelParams(target);
        target.searchParams.set('position', position);
        target.searchParams.set('theme', theme);
        target.searchParams.set('color', color.replace('#', ''));
        target.searchParams.set('linger', String(lingerSeconds));
        target.searchParams.set('percent', showPercent ? '1' : '0');
        return target.toString();
    }, [origin, appendChannelParams, position, theme, color, lingerSeconds, showPercent]);

    const config = useMemo(
        () => ({ position, theme, color, lingerSeconds, showPercent }),
        [position, theme, color, lingerSeconds, showPercent]
    );

    const emitUpdate = () => {
        bus.emit({
            id: Math.random().toString(),
            platform: 'kick',
            channel: 'test',
            timestamp: Date.now(),
            type: 'poll.update',
            pollId: demoRef.current.pollId,
            title: '¿Qué hacemos ahora?',
            options: demoRef.current.options.map((option) => ({ ...option })),
        });
    };

    const startPoll = () => {
        demoRef.current = {
            pollId: `demo-${Date.now()}`,
            options: DEMO_OPTIONS.map((option) => ({ ...option })),
        };
        emitUpdate();
    };

    const addVotes = (optionIndex: number, amount: number) => {
        const option = demoRef.current.options[optionIndex];
        if (!option) return;
        option.votes += amount;
        emitUpdate();
    };

    const endPoll = () => {
        bus.emit({
            id: Math.random().toString(),
            platform: 'kick',
            channel: 'test',
            timestamp: Date.now(),
            type: 'poll.end',
            pollId: demoRef.current.pollId,
        });
    };

    return (
        <BuilderShell
            url={url}
            previewActions={
                <>
                    <PreviewButton onClick={startPoll}>Iniciar</PreviewButton>
                    <PreviewButton onClick={() => addVotes(0, 3)}>+3 a la 1ª</PreviewButton>
                    <PreviewButton onClick={() => addVotes(1, 5)}>+5 a la 2ª</PreviewButton>
                    <PreviewButton onClick={() => addVotes(2, 1)}>+1 a la 3ª</PreviewButton>
                    <PreviewButton onClick={endPoll}>Terminar</PreviewButton>
                </>
            }
            preview={
                <div className="absolute inset-0">
                    <PollsOverlay config={config} />
                </div>
            }
        >
            <Section
                title="Canales"
                description="Atención: hoy las encuestas solo llegan desde Kick. Twitch necesita EventSub con permisos de broadcaster y YouTube no tiene API de encuestas."
            >
                <ChannelInputs />
            </Section>

            <Section title="Encuesta">
                <OptionCards
                    label="Posición en pantalla"
                    value={position}
                    onChange={setPosition}
                    options={POSITION_OPTIONS}
                    columns={3}
                />
                <SliderField
                    label="Cuánto queda visible al terminar"
                    value={lingerSeconds}
                    onChange={setLingerSeconds}
                    min={0}
                    max={30}
                    formatValue={(value) => (value === 0 ? 'Se va enseguida' : `${value} s`)}
                    hint="Tiempo que se sigue viendo el resultado después de que cierra la encuesta."
                />
                <ToggleField label="Mostrar porcentajes" checked={showPercent} onChange={setShowPercent} />
            </Section>

            <Section title="Apariencia">
                <OptionCards label="Tema" value={theme} onChange={setTheme} options={OVERLAY_THEME_OPTIONS} />
                <ColorField label="Color de las barras" value={color} onChange={setColor} />
            </Section>
        </BuilderShell>
    );
}
