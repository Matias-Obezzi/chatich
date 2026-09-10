'use client';

import React, { Suspense, use } from 'react';
import { getOverlay } from '@/component/overlays/registry';
import { StreamProvider } from '@/contexts/streamContext';

export default function OverlayPage(props: { params: Promise<{ type: string }> }) {
    const params = use(props.params);
    const overlayType = params.type;
    
    const overlayDef = getOverlay(overlayType);
    
    if (!overlayDef) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-transparent text-red-500 font-bold p-4">
                <div className="bg-slate-900/90 p-4 rounded-lg shadow-lg border border-red-500">
                    Error: el overlay &apos;{overlayType}&apos; no existe en el registry.
                </div>
            </div>
        );
    }
    
    const Component = overlayDef.component;
    
    return (
        <div className="w-full h-screen bg-transparent overflow-hidden">
            <Suspense fallback={null}>
                <StreamProvider>
                    <Component />
                </StreamProvider>
            </Suspense>
        </div>
    );
}
