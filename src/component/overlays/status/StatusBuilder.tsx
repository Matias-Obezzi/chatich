'use client';

import React, { useMemo, useState } from 'react';
import { useStream } from '@/contexts/streamContext';
import { useChannels } from '@/lib/useChannels';
import type { Platform } from '@/lib/events/types';
import StatusOverlay from './StatusOverlay';
import {
    BuilderShell,
    ChannelInputs,
    OptionCards,
    OVERLAY_THEME_OPTIONS,
    PreviewButton,
    Section,
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

const ORIENTATION_OPTIONS = [
    { value: 'horizontal', label: 'Horizontal', hint: 'Uno al lado del otro' },
    { value: 'vertical', label: 'Vertical', hint: 'Uno debajo del otro' },
];

const PLATFORMS: Array<{ id: Platform; label: string }> = [
    { id: 'twitch', label: 'Twitch' },
    { id: 'kick', label: 'Kick' },
    { id: 'youtube', label: 'YouTube' },
];

export default function StatusBuilder() {
    const { appendChannelParams } = useChannels();
    const { bus } = useStream();
    const origin = useOrigin();

    const [position, setPosition] = useState('top-left');
    const [theme, setTheme] = useState('glass');
    const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
    const [showUptime, setShowUptime] = useState(true);
    const [hideOffline, setHideOffline] = useState(false);

    const url = useMemo(() => {
        if (!origin) return '';
        let target = new URL(`${origin}/overlay/status`);
        target = appendChannelParams(target);
        target.searchParams.set('position', position);
        target.searchParams.set('theme', theme);
        target.searchParams.set('orientation', orientation);
        target.searchParams.set('uptime', showUptime ? '1' : '0');
        target.searchParams.set('hideOffline', hideOffline ? '1' : '0');
        return target.toString();
    }, [origin, appendChannelParams, position, theme, orientation, showUptime, hideOffline]);

    const config = useMemo(
        () => ({ position, theme, orientation, showUptime, hideOffline }),
        [position, theme, orientation, showUptime, hideOffline]
    );

    const togglePlatform = (platform: Platform, connected: boolean) => {
        bus.emit({
            id: Math.random().toString(),
            platform,
            channel: 'test',
            timestamp: Date.now(),
            type: connected ? 'stream.connected' : 'stream.disconnected',
        });
    };

    return (
        <BuilderShell
            url={url}
            previewActions={
                <>
                    {PLATFORMS.map((platform) => (
                        <PreviewButton key={platform.id} onClick={() => togglePlatform(platform.id, true)}>
                            + {platform.label}
                        </PreviewButton>
                    ))}
                    {PLATFORMS.map((platform) => (
                        <PreviewButton key={`off-${platform.id}`} onClick={() => togglePlatform(platform.id, false)}>
                            − {platform.label}
                        </PreviewButton>
                    ))}
                </>
            }
            preview={
                <div className="absolute inset-0">
                    <StatusOverlay config={config} />
                </div>
            }
        >
            <Section title="Canales">
                <ChannelInputs />
            </Section>

            <Section
                title="Estado"
                description="El uptime se cuenta desde que cada plataforma se conecta. La cantidad de viewers no se muestra porque el evento de conexión no la incluye."
            >
                <OptionCards
                    label="Posición en pantalla"
                    value={position}
                    onChange={setPosition}
                    options={POSITION_OPTIONS}
                    columns={3}
                />
                <OptionCards
                    label="Cómo se ordenan"
                    value={orientation}
                    onChange={(value) => setOrientation(value === 'vertical' ? 'vertical' : 'horizontal')}
                    options={ORIENTATION_OPTIONS}
                />
                <ToggleField label="Mostrar el uptime" checked={showUptime} onChange={setShowUptime} />
                <ToggleField
                    label="Ocultar las plataformas sin conexión"
                    checked={hideOffline}
                    onChange={setHideOffline}
                    hint="Si está apagado, las desconectadas se ven en gris."
                />
            </Section>

            <Section title="Apariencia">
                <OptionCards label="Tema" value={theme} onChange={setTheme} options={OVERLAY_THEME_OPTIONS} />
            </Section>
        </BuilderShell>
    );
}
