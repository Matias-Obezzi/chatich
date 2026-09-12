'use client';

import React, { useMemo, useState } from 'react';
import type { NowPlaying } from '@/lib/spotify';
import MusicOverlay from './MusicOverlay';
import {
    BuilderShell,
    ColorField,
    OptionCards,
    OVERLAY_THEME_OPTIONS,
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

/** La vista previa usa datos fijos: pegarle a Spotify desde el builder gastaría rate limit. */
const DEMO_TRACK: NowPlaying = {
    isPlaying: true,
    title: 'Nombre de la canción',
    artists: 'Artista',
    album: 'Álbum',
    progressMs: 74_000,
    durationMs: 210_000,
};

export default function MusicBuilder() {
    const origin = useOrigin();

    const [position, setPosition] = useState('bottom-left');
    const [theme, setTheme] = useState('glass');
    const [color, setColor] = useState('#53FC18');
    const [showArt, setShowArt] = useState(true);
    const [showProgress, setShowProgress] = useState(true);
    const [pollSeconds, setPollSeconds] = useState(8);

    const url = useMemo(() => {
        if (!origin) return '';
        const target = new URL(`${origin}/overlay/music`);
        target.searchParams.set('position', position);
        target.searchParams.set('theme', theme);
        target.searchParams.set('color', color.replace('#', ''));
        target.searchParams.set('art', showArt ? '1' : '0');
        target.searchParams.set('progress', showProgress ? '1' : '0');
        target.searchParams.set('poll', String(pollSeconds));
        return target.toString();
    }, [origin, position, theme, color, showArt, showProgress, pollSeconds]);

    const config = useMemo(
        () => ({ position, theme, color, showArt, showProgress, demo: DEMO_TRACK }),
        [position, theme, color, showArt, showProgress]
    );

    return (
        <BuilderShell
            url={url}
            previewLabel="Vista previa (datos de ejemplo)"
            preview={
                <div className="absolute inset-0">
                    <MusicOverlay config={config} />
                </div>
            }
        >
            <Section title="Spotify">
                <p className="text-xs text-muted">
                    La conexión se hace desde el overlay, no desde acá: el permiso queda guardado en el
                    navegador de OBS. Agregá la fuente, abrí &quot;Interactuar&quot; y tocá &quot;Conectar
                    con Spotify&quot;.{' '}
                    <a
                        href="/docs#spotify-obs"
                        target="_blank"
                        rel="noreferrer"
                        className="text-neon hover:underline font-medium"
                    >
                        Ver el paso a paso
                    </a>
                    .
                </p>
                <SliderField
                    label="Cada cuánto consulta la canción"
                    value={pollSeconds}
                    onChange={setPollSeconds}
                    min={3}
                    max={30}
                    formatValue={(value) => `${value} s`}
                    hint="Los límites de Spotify son por aplicación, no por usuario: consultar muy seguido los agota para todos."
                />
            </Section>

            <Section title="Apariencia">
                <OptionCards
                    label="Posición en pantalla"
                    value={position}
                    onChange={setPosition}
                    options={POSITION_OPTIONS}
                    columns={3}
                />
                <OptionCards label="Tema" value={theme} onChange={setTheme} options={OVERLAY_THEME_OPTIONS} />
                <ColorField label="Color de acento" value={color} onChange={setColor} />
                <ToggleField label="Mostrar la portada" checked={showArt} onChange={setShowArt} />
                <ToggleField label="Mostrar la barra de progreso" checked={showProgress} onChange={setShowProgress} />
            </Section>
        </BuilderShell>
    );
}
