'use client';

import React, { useMemo, useState } from 'react';
import ScreenOverlay, { BACKGROUND_TEXT_MAX, MIDDLE_TEXT_MAX } from './ScreenOverlay';
import {
    BuilderShell,
    ColorField,
    OptionCards,
    PreviewButton,
    Section,
    SliderField,
    TextField,
    useOrigin,
} from '../ui';

const BACKGROUND_OPTIONS = [
    { value: 'none', label: 'Liso', hint: 'Solo el color' },
    { value: 'image', label: 'Imagen', hint: 'Ondas fijas' },
    { value: 'interactive', label: 'Animado', hint: 'Ondas en canvas' },
];

type Preset = {
    label: string;
    middleText: string;
    backgroundText: string;
    textColor: string;
    bgColor: string;
    bgTextColor: string;
};

const PRESETS: Preset[] = [
    {
        label: 'Ya volvemos',
        middleText: 'BRB',
        backgroundText: 'VOLVEMOS EN UN RATO',
        textColor: '#FFFFFF',
        bgColor: '#06060B',
        bgTextColor: '#8B5CF6',
    },
    {
        label: 'Empezamos',
        middleText: 'PRONTO',
        backgroundText: 'EMPEZAMOS EN BREVE',
        textColor: '#FFFFFF',
        bgColor: '#0B0B14',
        bgTextColor: '#22D3EE',
    },
    {
        label: 'Gracias',
        middleText: 'GRACIAS',
        backgroundText: 'GRACIAS POR VER EL STREAM',
        textColor: '#FFFFFF',
        bgColor: '#12121D',
        bgTextColor: '#53FC18',
    },
];

export default function ScreenBuilder() {
    const origin = useOrigin();

    const [middleText, setMiddleText] = useState('BRB');
    const [middleSize, setMiddleSize] = useState(12);
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [bgColor, setBgColor] = useState('#06060B');
    const [backgroundText, setBackgroundText] = useState('VOLVEMOS EN UN RATO');
    const [bgTextColor, setBgTextColor] = useState('#8B5CF6');
    const [bgTextSpeed, setBgTextSpeed] = useState(18);
    const [bgTextRows, setBgTextRows] = useState(20);
    const [backgroundType, setBackgroundType] = useState('image');
    const [countdownMinutes, setCountdownMinutes] = useState(0);

    const applyPreset = (preset: Preset) => {
        setMiddleText(preset.middleText);
        setBackgroundText(preset.backgroundText);
        setTextColor(preset.textColor);
        setBgColor(preset.bgColor);
        setBgTextColor(preset.bgTextColor);
    };

    const config = useMemo(
        () => ({
            middleText,
            middleSize,
            textColor,
            bgColor,
            backgroundText,
            bgTextColor,
            bgTextSpeed,
            bgTextRows,
            backgroundType,
            countdownMinutes,
        }),
        [middleText, middleSize, textColor, bgColor, backgroundText, bgTextColor, bgTextSpeed, bgTextRows, backgroundType, countdownMinutes]
    );

    const url = useMemo(() => {
        if (!origin) return '';
        const target = new URL(`${origin}/screen`);
        if (middleText) target.searchParams.set('middleText', middleText);
        if (backgroundText) target.searchParams.set('backgroundText', backgroundText);
        target.searchParams.set('middleSize', String(middleSize));
        target.searchParams.set('textColor', textColor.replace('#', ''));
        target.searchParams.set('bgColor', bgColor.replace('#', ''));
        target.searchParams.set('bgTextColor', bgTextColor.replace('#', ''));
        target.searchParams.set('bgTextSpeed', String(bgTextSpeed));
        target.searchParams.set('bgTextRows', String(bgTextRows));
        target.searchParams.set('backgroundType', backgroundType);
        if (countdownMinutes > 0) target.searchParams.set('countdown', String(countdownMinutes));
        return target.toString();
    }, [origin, middleText, backgroundText, middleSize, textColor, bgColor, bgTextColor, bgTextSpeed, bgTextRows, backgroundType, countdownMinutes]);

    return (
        <BuilderShell
            url={url}
            previewActions={PRESETS.map((preset) => (
                <PreviewButton key={preset.label} onClick={() => applyPreset(preset)}>
                    {preset.label}
                </PreviewButton>
            ))}
            preview={
                <div className="absolute inset-0">
                    <ScreenOverlay config={config} />
                </div>
            }
        >
            <Section
                title="Texto principal"
                description="Los botones de arriba de la vista previa cargan combinaciones listas para arrancar."
            >
                <TextField
                    label="Texto del centro"
                    value={middleText}
                    onChange={(value) => setMiddleText(value.slice(0, MIDDLE_TEXT_MAX))}
                    placeholder="BRB"
                    hint={`${middleText.length}/${MIDDLE_TEXT_MAX} caracteres.`}
                />
                <SliderField
                    label="Tamaño del texto"
                    value={middleSize}
                    onChange={setMiddleSize}
                    min={4}
                    max={24}
                    formatValue={(value) => `${value}% del ancho`}
                />
                <ColorField label="Color del texto" value={textColor} onChange={setTextColor} />
                <SliderField
                    label="Cuenta regresiva"
                    value={countdownMinutes}
                    onChange={setCountdownMinutes}
                    min={0}
                    max={60}
                    formatValue={(value) => (value === 0 ? 'Sin cuenta' : `${value} min`)}
                    hint="Arranca cuando la fuente aparece en OBS, así que se reinicia sola cada vez que volvés a la escena."
                />
            </Section>

            <Section title="Texto de fondo">
                <TextField
                    label="Texto"
                    value={backgroundText}
                    onChange={(value) => setBackgroundText(value.slice(0, BACKGROUND_TEXT_MAX))}
                    placeholder="VOLVEMOS EN UN RATO"
                    hint={`Se repite en filas animadas. ${backgroundText.length}/${BACKGROUND_TEXT_MAX} caracteres.`}
                />
                <ColorField label="Color" value={bgTextColor} onChange={setBgTextColor} allowAlpha />
                <SliderField
                    label="Velocidad"
                    value={bgTextSpeed}
                    onChange={setBgTextSpeed}
                    min={5}
                    max={60}
                    formatValue={(value) => (value <= 10 ? 'Rápida' : value >= 40 ? 'Muy lenta' : `${value} s por vuelta`)}
                    hint="Es cuánto tarda una pasada completa: más segundos, más lento."
                />
                <SliderField
                    label="Cantidad de filas"
                    value={bgTextRows}
                    onChange={setBgTextRows}
                    min={4}
                    max={30}
                    formatValue={(value) => `${value} filas`}
                />
            </Section>

            <Section title="Fondo">
                <OptionCards
                    label="Tipo"
                    value={backgroundType}
                    onChange={setBackgroundType}
                    options={BACKGROUND_OPTIONS}
                    columns={3}
                />
                <ColorField label="Color de fondo" value={bgColor} onChange={setBgColor} />
            </Section>
        </BuilderShell>
    );
}
