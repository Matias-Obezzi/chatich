'use client';

import React, { Suspense, use } from 'react';
import Link from 'next/link';
import SiteLayout from '@/component/SiteLayout';
import { getOverlay } from '@/component/overlays/registry';
import { StreamProvider } from '@/contexts/streamContext';

const BUILDER_LINKS = [
    { type: 'chat', label: 'Chat' },
    { type: 'alerts', label: 'Alertas' },
    { type: 'goals', label: 'Metas' },
    { type: 'emotes', label: 'Emotes' }
];

function BuilderTabs({ overlayType, name, description }: { overlayType: string; name?: string; description?: string }) {
    return (
        <div className="bg-surface/60 border-b border-border backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <span className="font-chakra text-muted font-bold text-sm hidden sm:inline">OVERLAYS:</span>
                    <div className="flex gap-2 overflow-x-auto">
                        {BUILDER_LINKS.map(link => {
                            const isActive = link.type === overlayType;
                            return (
                                <Link
                                    key={link.type}
                                    href={`/overlay/${link.type}/builder`}
                                    className={`whitespace-nowrap rounded-xl px-3 py-1 transition-colors focus:outline-none focus:ring-2 focus:ring-neon/50 ${
                                        isActive
                                            ? 'bg-neon text-bg font-bold shadow-[0_0_10px_rgba(139,92,246,0.4)] text-xs uppercase tracking-wider'
                                            : 'text-text/70 hover:text-text text-sm'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
                {name && (
                    <div className="text-sm text-muted hidden lg:block truncate">
                        <span className="font-semibold text-text/90">{name}</span> — {description}
                    </div>
                )}
            </div>
        </div>
    );
}

function BuilderNotice({ overlayType, tone, title, message }: { overlayType: string; tone: 'error' | 'warning'; title: string; message: string }) {
    const toneClass = tone === 'error' ? 'border-youtube text-youtube' : 'border-neon-2 text-neon-2';
    return (
        <SiteLayout
            beforeMain={<BuilderTabs overlayType={overlayType} />}
            mainClassName="flex-grow flex flex-col items-center justify-center gap-4 p-6"
        >
            <div className={`bg-surface p-6 rounded-xl border ${toneClass} text-center max-w-md`}>
                <h2 className="text-xl font-chakra font-bold mb-2">{title}</h2>
                <p className="text-text">{message}</p>
            </div>
            <Link href="/" className="px-4 py-2 bg-surface border border-border hover:bg-surface-2 rounded-xl transition-colors text-text">
                Volver al inicio
            </Link>
        </SiteLayout>
    );
}

export default function BuilderPage(props: { params: Promise<{ type: string }> }) {
    const params = use(props.params);
    const overlayType = params.type;

    const overlayDef = getOverlay(overlayType);

    if (!overlayDef) {
        return (
            <BuilderNotice
                overlayType={overlayType}
                tone="error"
                title="Error"
                message={`El overlay '${overlayType}' no existe en el registry.`}
            />
        );
    }

    const BuilderComponent = overlayDef.builder;

    if (!BuilderComponent) {
        return (
            <BuilderNotice
                overlayType={overlayType}
                tone="warning"
                title="Atención"
                message={`El overlay '${overlayType}' no tiene un builder configurado.`}
            />
        );
    }

    return (
        <SiteLayout
            beforeMain={<BuilderTabs overlayType={overlayType} name={overlayDef.name} description={overlayDef.description} />}
            mainClassName="p-4 md:p-6 flex-grow flex flex-col"
        >
            <Suspense fallback={<div className="flex items-center justify-center h-full text-muted">Cargando builder...</div>}>
                <StreamProvider>
                    <BuilderComponent />
                </StreamProvider>
            </Suspense>
        </SiteLayout>
    );
}
