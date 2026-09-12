'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { exchangeCodeForTokens } from '@/lib/spotify';

type State = 'working' | 'done' | 'error';

function SpotifyCallback() {
    const searchParams = useSearchParams();
    const [state, setState] = useState<State>('working');
    const [message, setMessage] = useState('Conectando con Spotify...');

    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            setState('error');
            setMessage(error === 'access_denied' ? 'Cancelaste la autorización.' : `Spotify devolvió un error: ${error}`);
            return;
        }

        const code = searchParams.get('code');
        if (!code) {
            setState('error');
            setMessage('Spotify no devolvió ningún código de autorización.');
            return;
        }

        exchangeCodeForTokens(code)
            .then(() => {
                setState('done');
                setMessage('Listo. Ya podés cerrar esta ventana y volver a tu overlay.');
            })
            .catch((err: unknown) => {
                setState('error');
                setMessage(err instanceof Error ? err.message : 'No se pudo completar la conexión.');
            });
    }, [searchParams]);

    const toneClass = state === 'error' ? 'border-youtube text-youtube' : 'border-border text-text';

    return (
        <div className="w-full min-h-screen bg-bg text-text font-inter flex items-center justify-center p-6">
            <div className={`bg-surface border ${toneClass} rounded-xl p-8 max-w-md text-center space-y-3`}>
                <h1 className="font-chakra text-xl font-bold">Spotify</h1>
                <p className="text-sm">{message}</p>
                {state === 'done' && (
                    <p className="text-xs text-muted">
                        La autorización queda guardada en este navegador. Si autorizaste desde OBS, el
                        overlay ya debería mostrar la canción.
                    </p>
                )}
                {state === 'error' && (
                    <p className="text-xs text-muted">
                        Volvé al overlay y tocá &quot;Conectar con Spotify&quot; para intentar de nuevo.
                    </p>
                )}
            </div>
        </div>
    );
}

export default function SpotifyCallbackPage() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen bg-bg" />}>
            <SpotifyCallback />
        </Suspense>
    );
}
