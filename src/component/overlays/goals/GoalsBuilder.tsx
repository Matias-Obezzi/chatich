'use client';

import React, { useMemo, useState } from 'react';
import { useStream } from '@/contexts/streamContext';
import GoalsOverlay from './GoalsOverlay';
import { useChannels } from '@/lib/useChannels';
import {
    BuilderShell,
    ChannelInputs,
    ColorField,
    OptionCards,
    PreviewButton,
    Section,
    TextField,
    useOrigin,
} from '../ui';

const TYPE_OPTIONS = [
    { value: 'subs', label: 'Suscriptores' },
    { value: 'followers', label: 'Seguidores' },
    { value: 'bits', label: 'Bits' },
    { value: 'donations', label: 'Donaciones' },
];

const THEME_OPTIONS = [
    { value: 'glass', label: 'Vidrio', hint: 'Translúcido' },
    { value: 'default', label: 'Sólido', hint: 'Oscuro' },
];

export default function GoalsBuilder() {
    const { appendChannelParams } = useChannels();
    const { bus } = useStream();
    const origin = useOrigin();

    const [type, setType] = useState('subs');
    const [title, setTitle] = useState('Sub Goal');
    const [target, setTarget] = useState('100');
    const [current, setCurrent] = useState('0');
    const [theme, setTheme] = useState('glass');
    const [color, setColor] = useState('#8B5CF6');

    const url = useMemo(() => {
        if (!origin) return '';
        let target_ = new URL(`${origin}/overlay/goals`);
        target_ = appendChannelParams(target_);
        target_.searchParams.set('type', type);
        target_.searchParams.set('title', title);
        target_.searchParams.set('target', target);
        target_.searchParams.set('current', current);
        target_.searchParams.set('theme', theme);
        target_.searchParams.set('color', color);
        return target_.toString();
    }, [origin, appendChannelParams, type, title, target, current, theme, color]);

    const simulateEvent = (amount: number) => {
        if (type === 'bits') {
            bus.emit({
                id: Math.random().toString(),
                platform: 'twitch',
                channel: 'test',
                timestamp: Date.now(),
                type: 'cheer',
                actor: { username: 'cheer_user' },
                bits: amount,
            });
            return;
        }

        if (type === 'donations') {
            bus.emit({
                id: Math.random().toString(),
                platform: 'youtube',
                channel: 'test',
                timestamp: Date.now(),
                type: 'superchat',
                actor: { username: 'dono_user' },
                amount,
                currency: 'USD',
            });
            return;
        }

        for (let i = 0; i < amount; i++) {
            bus.emit({
                id: Math.random().toString(),
                platform: 'twitch',
                channel: 'test',
                timestamp: Date.now(),
                type: 'sub.new',
                actor: { username: 'test_user' },
            });
        }
    };

    return (
        <BuilderShell
            url={url}
            previewActions={
                <>
                    <PreviewButton onClick={() => simulateEvent(1)}>+1</PreviewButton>
                    <PreviewButton onClick={() => simulateEvent(5)}>+5</PreviewButton>
                    <PreviewButton onClick={() => simulateEvent(10)}>+10</PreviewButton>
                </>
            }
            preview={
                <div className="absolute inset-0">
                    <GoalsOverlay
                        config={{
                            type,
                            title,
                            target: parseInt(target, 10) || 0,
                            current: parseInt(current, 10) || 0,
                            theme,
                            color,
                        }}
                    />
                </div>
            }
        >
            <Section title="Canales">
                <ChannelInputs />
            </Section>

            <Section title="Meta">
                <OptionCards label="Qué querés contar" value={type} onChange={setType} options={TYPE_OPTIONS} />
                <TextField label="Título" value={title} onChange={setTitle} placeholder="Ej: Sub Goal" />
                <div className="flex gap-3">
                    <TextField
                        label="Valor inicial"
                        value={current}
                        onChange={setCurrent}
                        type="number"
                        min={0}
                        className="flex-1"
                    />
                    <TextField
                        label="Objetivo"
                        value={target}
                        onChange={setTarget}
                        type="number"
                        min={1}
                        className="flex-1"
                    />
                </div>
            </Section>

            <Section title="Apariencia">
                <OptionCards label="Tema" value={theme} onChange={setTheme} options={THEME_OPTIONS} />
                <ColorField label="Color de la barra" value={color} onChange={setColor} />
            </Section>
        </BuilderShell>
    );
}
