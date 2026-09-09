'use client';

import React from 'react';
import DebugPanel from './DebugPanel';

export default function DebugOverlay() {
    return (
        <div className="w-full h-screen p-8 flex items-start justify-end pointer-events-none">
            <div className="pointer-events-auto">
                <DebugPanel />
            </div>
        </div>
    );
}
