'use client';

import React, { useMemo, useState } from 'react';
import { Message } from '@/component/chat/message';
import type { ChatMessageEvent } from '@/lib/events/types';
import type { CustomStyles } from '@/component/chat/index';
import { useChannels } from '@/lib/useChannels';
import {
    BuilderShell,
    ChannelInputs,
    ColorField,
    OptionCards,
    OVERLAY_THEME_OPTIONS,
    Section,
    SliderField,
    useOrigin,
} from '../ui';
import type { OverlayTheme } from '../ui';

const PREVIEW_MESSAGES: ChatMessageEvent[] = [
    {
        id: '1',
        type: 'chat.message',
        platform: 'twitch',
        channel: 'test',
        text: 'Hello from Twitch! Kappa',
        actor: { id: '1', username: 'twitch_user', displayName: 'TwitchUser', color: '#9146FF' },
        timestamp: 0,
    },
    {
        id: '2',
        type: 'chat.message',
        platform: 'youtube',
        channel: 'test',
        text: 'This is a message from YouTube',
        actor: { id: '2', username: 'yt_user', displayName: 'YTUser', color: '#FF0033' },
        timestamp: 0,
    },
    {
        id: '3',
        type: 'chat.message',
        platform: 'kick',
        channel: 'test',
        text: 'Kick is here too!',
        actor: { id: '3', username: 'kick_user', displayName: 'KickUser', color: '#53FC18' },
        timestamp: 0,
    },
];

const LAYOUT_OPTIONS = [
    { value: 'vertical', label: 'Vertical', hint: 'Uno debajo del otro' },
    { value: 'horizontal', label: 'Horizontal', hint: 'Uno al lado del otro' },
];

const TTL_OPTIONS = [
    { value: '', label: 'Siempre' },
    { value: '15000', label: '15 s' },
    { value: '30000', label: '30 s' },
    { value: '60000', label: '1 min' },
    { value: '300000', label: '5 min' },
];

const RADIUS_OPTIONS = [
    { value: '0px', label: 'Cuadrado' },
    { value: '8px', label: 'Redondeado' },
    { value: '16px', label: 'Muy redondeado' },
    { value: '9999px', label: 'Píldora' },
];

export default function ChatBuilder() {
    const { appendChannelParams } = useChannels();
    const origin = useOrigin();

    const [layout, setLayout] = useState<'horizontal' | 'vertical'>('vertical');
    const [theme, setTheme] = useState<OverlayTheme>('glass');
    const [ttl, setTtl] = useState('');
    const [background, setBackground] = useState('rgba(18, 18, 29, 0.85)');
    const [textColor, setTextColor] = useState('#EDEDF5');
    const [fontSize, setFontSize] = useState(16);
    const [borderRadius, setBorderRadius] = useState('8px');

    const styles: CustomStyles = useMemo(
        () => ({
            'message-background': background,
            'message-color': textColor,
            'message-font-size': `${fontSize}px`,
            'message-border-radius': borderRadius,
        }),
        [background, textColor, fontSize, borderRadius]
    );

    const url = useMemo(() => {
        if (!origin) return '';
        let target = new URL(`${origin}/overlay/chat`);
        target = appendChannelParams(target);
        target.searchParams.set('layout', layout);
        target.searchParams.set('theme', theme);
        if (ttl) target.searchParams.set('ttl', ttl);
        target.searchParams.set('styles', JSON.stringify(styles));
        return target.toString();
    }, [origin, appendChannelParams, layout, theme, ttl, styles]);

    return (
        <BuilderShell
            url={url}
            preview={
                <div
                    className={`absolute inset-0 p-8 flex gap-4 overflow-hidden ${
                        layout === 'vertical' ? 'flex-col justify-end items-start' : 'flex-row items-end justify-end'
                    }`}
                >
                    {PREVIEW_MESSAGES.map((message) => (
                        <Message key={message.id} message={message} styles={styles} layout={layout} theme={theme} />
                    ))}
                </div>
            }
        >
            <Section title="Canales">
                <ChannelInputs />
            </Section>

            <Section title="Disposición">
                <OptionCards
                    label="Cómo se apilan los mensajes"
                    value={layout}
                    onChange={(value) => setLayout(value === 'horizontal' ? 'horizontal' : 'vertical')}
                    options={LAYOUT_OPTIONS}
                />
                <OptionCards
                    label="Cuánto dura cada mensaje"
                    value={ttl}
                    onChange={setTtl}
                    options={TTL_OPTIONS}
                    columns={3}
                    hint="Pasado ese tiempo el mensaje desaparece de la pantalla."
                />
            </Section>

            <Section title="Estilo">
                <OptionCards label="Tema" value={theme} onChange={(value) => setTheme(value as OverlayTheme)} options={OVERLAY_THEME_OPTIONS} />
                <ColorField label="Fondo del mensaje" value={background} onChange={setBackground} allowAlpha />
                <ColorField label="Color del texto" value={textColor} onChange={setTextColor} />
                <SliderField
                    label="Tamaño del texto"
                    value={fontSize}
                    onChange={setFontSize}
                    min={12}
                    max={40}
                    formatValue={(value) => `${value} px`}
                />
                <OptionCards label="Forma del borde" value={borderRadius} onChange={setBorderRadius} options={RADIUS_OPTIONS} />
            </Section>
        </BuilderShell>
    );
}
