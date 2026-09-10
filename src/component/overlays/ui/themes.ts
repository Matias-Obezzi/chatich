import type { CSSProperties } from 'react';
import type { Option } from './fields';

export type OverlayTheme = 'solid' | 'glass';

export const OVERLAY_THEME_OPTIONS: Option[] = [
    { value: 'solid', label: 'Sólido', hint: 'Fondo opaco' },
    { value: 'glass', label: 'Vidrio', hint: 'Translúcido y desenfocado' },
];

/**
 * Los valores heredados ('default', 'dark', 'neon', 'light') de URLs viejas caen en 'solid'.
 *
 * `fallback` es lo que se usa cuando no vino ningún valor, y existe para no cambiarle el
 * aspecto a las URLs ya pegadas en OBS: alertas y metas tenían por defecto un tema opaco,
 * pero el chat nunca tuvo parámetro `theme` y siempre se dibujó con desenfoque, así que
 * ahí el default tiene que ser 'glass'.
 */
export function normalizeTheme(value?: string | null, fallback: OverlayTheme = 'solid'): OverlayTheme {
    if (value === 'glass') return 'glass';
    if (value === 'solid') return 'solid';
    return value ? 'solid' : fallback;
}

/**
 * Tratamiento visual del panel de un overlay: mismo look en chat, alertas y metas.
 * `className` sirve para paneles Tailwind con fondo propio del tema (goals, alerts).
 * `style` expone el mismo desenfoque/borde/sombra como propiedades sueltas para
 * componentes que necesitan mantener un fondo elegido por el usuario (chat).
 */
export function themeSurface(theme: OverlayTheme): { className: string; style: CSSProperties } {
    if (theme === 'glass') {
        return {
            className: 'bg-surface/40 backdrop-blur-md border border-text/10 shadow-xl',
            style: {
                backdropFilter: 'blur(12px)',
                border: '1px solid color-mix(in srgb, var(--text) 10%, transparent)',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.45), 0 8px 10px -6px rgba(0,0,0,0.45)',
            },
        };
    }
    return {
        className: 'bg-surface/95 border border-border shadow-lg',
        style: {
            border: '1px solid var(--border)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.35), 0 4px 6px -4px rgba(0,0,0,0.35)',
        },
    };
}
