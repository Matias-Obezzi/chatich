'use client';

import React, { useMemo, useState } from 'react';
import { useStream } from '@/contexts/streamContext';
import { StreamEventType } from '@/lib/events/types';
import AlertsOverlay from './AlertsOverlay';
import { useChannels } from '@/lib/useChannels';
import {
    BuilderShell,
    ChannelInputs,
    CheckboxList,
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

const EVENT_GROUPS: Array<{ key: keyof EventFilters; label: string; types: StreamEventType[] }> = [
    { key: 'subs', label: 'Suscripciones', types: ['sub.new', 'sub.resub'] },
    { key: 'gifts', label: 'Suscripciones regaladas', types: ['sub.gift'] },
    { key: 'raids', label: 'Raids', types: ['raid'] },
    { key: 'cheers', label: 'Cheers / Bits', types: ['cheer'] },
    { key: 'superchats', label: 'Super Chats / Miembros', types: ['superchat', 'member.new'] },
];

type EventFilters = {
    subs: boolean;
    gifts: boolean;
    raids: boolean;
    cheers: boolean;
    superchats: boolean;
};

export default function AlertsBuilder() {
    const { appendChannelParams } = useChannels();
    const { bus } = useStream();
    const origin = useOrigin();

    const [position, setPosition] = useState('top-center');
    const [durationSeconds, setDurationSeconds] = useState(6);
    const [theme, setTheme] = useState('glass');
    const [useAccent, setUseAccent] = useState(false);
    const [accent, setAccent] = useState('#8B5CF6');
    const [sound, setSound] = useState(false);
    const [events, setEvents] = useState<EventFilters>({
        subs: true,
        gifts: true,
        raids: true,
        cheers: true,
        superchats: true,
    });

    const activeEventTypes = useMemo(() => {
        if (EVENT_GROUPS.every((group) => events[group.key])) return undefined;
        return EVENT_GROUPS.filter((group) => events[group.key]).flatMap((group) => group.types);
    }, [events]);

    const url = useMemo(() => {
        if (!origin) return '';
        let target = new URL(`${origin}/overlay/alerts`);
        target = appendChannelParams(target);
        target.searchParams.set('position', position);
        target.searchParams.set('duration', String(durationSeconds * 1000));
        target.searchParams.set('theme', theme);
        if (useAccent) target.searchParams.set('accent', accent.replace('#', ''));
        target.searchParams.set('sound', sound ? '1' : '0');
        if (activeEventTypes) target.searchParams.set('events', activeEventTypes.join(','));
        return target.toString();
    }, [origin, appendChannelParams, position, durationSeconds, theme, useAccent, accent, sound, activeEventTypes]);

    const config = useMemo(
        () => ({
            position,
            duration: durationSeconds * 1000,
            theme,
            accent: useAccent ? accent.replace('#', '') : undefined,
            sound,
            events: activeEventTypes,
        }),
        [position, durationSeconds, theme, useAccent, accent, sound, activeEventTypes]
    );

    const emit = (event: Parameters<typeof bus.emit>[0]) => bus.emit(event);

    const simulateSub = () =>
        emit({
            id: Math.random().toString(),
            platform: 'twitch',
            channel: 'test',
            timestamp: Date.now(),
            type: 'sub.new',
            actor: { username: 'test_user', displayName: 'TestUser' },
        });

    const simulateGiftBomb = () => {
        const actor = { username: 'gifty', displayName: 'Gifty' };
        for (let i = 0; i < 5; i++) {
            emit({
                id: Math.random().toString(),
                platform: 'twitch',
                channel: 'test',
                timestamp: Date.now(),
                type: 'sub.gift',
                actor,
                count: 1,
            });
        }
    };

    const simulateRaid = () =>
        emit({
            id: Math.random().toString(),
            platform: 'twitch',
            channel: 'test',
            timestamp: Date.now(),
            type: 'raid',
            actor: { username: 'raider', displayName: 'Raider' },
            viewers: 100,
        });

    const simulateSuperChat = () =>
        emit({
            id: Math.random().toString(),
            platform: 'youtube',
            channel: 'test',
            timestamp: Date.now(),
            type: 'superchat',
            actor: { username: 'dono_user', displayName: 'DonoUser' },
            amount: 50,
            currency: 'USD',
        });

    const simulateBits = () =>
        emit({
            id: Math.random().toString(),
            platform: 'twitch',
            channel: 'test',
            timestamp: Date.now(),
            type: 'cheer',
            actor: { username: 'cheer_user', displayName: 'CheerUser' },
            bits: 1000,
        });

    return (
        <BuilderShell
            url={url}
            previewLabel="Pruebas en vivo"
            previewActions={
                <>
                    <PreviewButton onClick={simulateSub}>Sub</PreviewButton>
                    <PreviewButton onClick={simulateGiftBomb}>Gift x5</PreviewButton>
                    <PreviewButton onClick={simulateRaid}>Raid</PreviewButton>
                    <PreviewButton onClick={simulateSuperChat}>Super Chat</PreviewButton>
                    <PreviewButton onClick={simulateBits}>Bits</PreviewButton>
                </>
            }
            preview={
                <div className="absolute inset-0">
                    <AlertsOverlay config={config} />
                </div>
            }
        >
            <Section title="Canales">
                <ChannelInputs />
            </Section>

            <Section title="Alertas">
                <OptionCards
                    label="Posición en pantalla"
                    value={position}
                    onChange={setPosition}
                    options={POSITION_OPTIONS}
                    columns={3}
                />
                <SliderField
                    label="Cuánto dura cada alerta"
                    value={durationSeconds}
                    onChange={setDurationSeconds}
                    min={2}
                    max={15}
                    formatValue={(value) => `${value} s`}
                />
                <ToggleField
                    label="Sonido"
                    checked={sound}
                    onChange={setSound}
                    hint="Reproduce un sonido cada vez que aparece una alerta."
                />
            </Section>

            <Section title="Apariencia">
                <OptionCards label="Tema" value={theme} onChange={setTheme} options={OVERLAY_THEME_OPTIONS} />
                <ToggleField
                    label="Usar un color de acento propio"
                    checked={useAccent}
                    onChange={setUseAccent}
                    hint="Si está apagado, cada alerta usa el color de su plataforma."
                />
                {useAccent && <ColorField label="Color de acento" value={accent} onChange={setAccent} />}
            </Section>

            <Section title="Qué mostrar">
                <CheckboxList
                    label="Eventos"
                    items={EVENT_GROUPS.map((group) => ({
                        key: group.key,
                        label: group.label,
                        checked: events[group.key],
                    }))}
                    onToggle={(key, checked) => setEvents((prev) => ({ ...prev, [key]: checked }))}
                />
            </Section>
        </BuilderShell>
    );
}
