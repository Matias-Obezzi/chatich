'use client';

import React, { useMemo } from 'react';
import { useChannels } from '@/lib/useChannels';
import { useStream } from '@/contexts/streamContext';
import DebugPanel from './DebugPanel';
import { BuilderShell, ChannelInputs, Section, useOrigin } from '../ui';

export default function DebugBuilder() {
    const { appendChannelParams } = useChannels();
    const origin = useOrigin();

    const url = useMemo(() => {
        if (!origin) return '';
        let target = new URL(`${origin}/overlay/debug`);
        target = appendChannelParams(target);
        return target.toString();
    }, [origin, appendChannelParams]);

    return (
        <BuilderShell
            url={url}
            previewLabel="Emisor de eventos"
            preview={
                <div className="absolute inset-0 p-6 overflow-auto flex items-start justify-between gap-4">
                    <LiveMessages />
                    <div className="pointer-events-auto shrink-0">
                        <DebugPanel />
                    </div>
                </div>
            }
        >
            <Section
                title="Canales"
                description="Este overlay no tiene apariencia que configurar: es una herramienta para emitir eventos sintéticos y probar el resto de los overlays. Si completás los canales, además se conecta a los chats reales."
            >
                <ChannelInputs />
            </Section>
        </BuilderShell>
    );
}

/**
 * Lista en vivo de los mensajes que hay en memoria. Sirve para ver el efecto de la
 * moderación: al emitir un ban o un clear, los mensajes tienen que desaparecer de acá.
 */
function LiveMessages() {
    const { messages } = useStream();

    return (
        <div className="min-w-0 flex-1 text-text" data-testid="live-messages">
            <p className="text-xs text-muted mb-2">
                Mensajes en memoria: <span data-testid="message-count">{messages.length}</span>
            </p>
            <div className="space-y-1">
                {messages.slice(-12).map((message) => (
                    <div key={message.id} className="text-xs bg-bg-2 border border-border rounded-lg px-2 py-1 truncate">
                        <span className="font-semibold">{message.actor.displayName || message.actor.username}</span>
                        <span className="text-muted"> · {message.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
