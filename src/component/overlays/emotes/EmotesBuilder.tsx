'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useChannels } from '@/lib/useChannels';
import {
    BuilderShell,
    ChannelInputs,
    OptionCards,
    PreviewButton,
    Section,
    SliderField,
    useOrigin,
} from '../ui';

const DENSITY_OPTIONS = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
];

const SPEED_OPTIONS = [
    { value: 'slow', label: 'Lenta' },
    { value: 'normal', label: 'Normal' },
    { value: 'fast', label: 'Rápida' },
];

const TRIGGER_OPTIONS = [
    { value: 'all', label: 'Cada mensaje del chat', hint: '1 a 3 emotes por mensaje' },
    { value: 'special', label: 'Solo eventos grandes', hint: 'Raids, subs y superchats' },
];

export default function EmotesBuilder() {
    const { appendChannelParams } = useChannels();
    const origin = useOrigin();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [density, setDensity] = useState('medium');
    const [speed, setSpeed] = useState('normal');
    const [size, setSize] = useState(40);
    const [trigger, setTrigger] = useState('all');

    const url = useMemo(() => {
        if (!origin) return '';
        let target = new URL(`${origin}/overlay/emotes`);
        target = appendChannelParams(target);
        target.searchParams.set('density', density);
        target.searchParams.set('speed', speed);
        target.searchParams.set('size', String(size));
        target.searchParams.set('trigger', trigger);
        return target.toString();
    }, [origin, appendChannelParams, density, speed, size, trigger]);

    const testBurst = (count: number) => {
        iframeRef.current?.contentWindow?.postMessage({ type: 'test_burst', count }, '*');
    };

    return (
        <BuilderShell
            url={url}
            previewActions={
                <>
                    <PreviewButton onClick={() => testBurst(20)}>Lanzar lluvia</PreviewButton>
                    <PreviewButton onClick={() => testBurst(100)}>Simular raid</PreviewButton>
                </>
            }
            preview={
                url ? (
                    <iframe
                        ref={iframeRef}
                        src={url}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ border: 'none' }}
                        title="Vista previa del overlay de emotes"
                    />
                ) : null
            }
        >
            <Section title="Canales">
                <ChannelInputs />
            </Section>

            <Section title="Lluvia de emotes">
                <OptionCards label="Cantidad de emotes" value={density} onChange={setDensity} options={DENSITY_OPTIONS} columns={3} />
                <OptionCards label="Velocidad de caída" value={speed} onChange={setSpeed} options={SPEED_OPTIONS} columns={3} />
                <SliderField
                    label="Tamaño de los emotes"
                    value={size}
                    onChange={setSize}
                    min={16}
                    max={120}
                    step={2}
                    formatValue={(value) => `${value} px`}
                />
                <OptionCards
                    label="Cuándo caen"
                    value={trigger}
                    onChange={setTrigger}
                    options={TRIGGER_OPTIONS}
                    columns={1}
                />
            </Section>
        </BuilderShell>
    );
}
