'use client';

import { useEffect, useState } from 'react';

/**
 * Devuelve window.location.origin una vez montado el componente.
 * Durante el render del servidor devuelve '' para no romper la hidratación.
 */
export function useOrigin(): string {
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    return origin;
}
