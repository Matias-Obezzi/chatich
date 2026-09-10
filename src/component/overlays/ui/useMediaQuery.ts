'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Coincide con una media query sin desajustes de hidratación.
 *
 * `serverFallback` es lo que se asume durante el render del servidor, donde no hay
 * `matchMedia`. Elegilo según qué rama se vea menos rota antes de que hidrate:
 * el HTML del servidor se pinta primero y recién después React corrige.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
    const subscribe = useCallback(
        (callback: () => void) => {
            const mql = window.matchMedia(query);
            mql.addEventListener('change', callback);
            return () => mql.removeEventListener('change', callback);
        },
        [query],
    );

    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
    const getServerSnapshot = useCallback(() => serverFallback, [serverFallback]);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
