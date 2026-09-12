/**
 * Catálogo de overlays: nombre y descripción de cada uno, en un solo lugar.
 *
 * Está separado del registry a propósito. El registry importa los componentes de todos los
 * overlays, así que importarlo desde la landing arrastraría todo ese bundle a la página más
 * visitada del sitio. Este archivo no importa nada, y es el que consume tanto la landing
 * como cada definición del registry, para que no se desincronicen.
 */

export type OverlayCatalogEntry = {
    id: string;
    name: string;
    description: string;
    /** Clase del token de color que identifica al overlay en la landing. */
    accentClass: string;
    /** Ruta del overlay; casi todos viven bajo /overlay, la pantalla de pausa no. */
    path: string;
    /** Aclaración de alcance, cuando no funciona en las tres plataformas. */
    note?: string;
};

export const OVERLAY_CATALOG = {
    chat: {
        id: 'chat',
        name: 'Chat combinado',
        description: 'Los mensajes de Twitch, Kick y YouTube juntos en un solo feed.',
        accentClass: 'bg-neon',
        path: '/overlay/chat',
    },
    alerts: {
        id: 'alerts',
        name: 'Alertas',
        description: 'Subs, bits, raids y superchats, encolados para que no se pisen.',
        accentClass: 'bg-neon-2',
        path: '/overlay/alerts',
    },
    goals: {
        id: 'goals',
        name: 'Metas',
        description: 'Una barra de progreso para metas de subs, seguidores, bits o donaciones.',
        accentClass: 'bg-neon-3',
        path: '/overlay/goals',
    },
    emotes: {
        id: 'emotes',
        name: 'Lluvia de emotes',
        description: 'Emotes cayendo en pantalla con cada mensaje o evento grande.',
        accentClass: 'bg-kick',
        path: '/overlay/emotes',
    },
    polls: {
        id: 'polls',
        name: 'Encuestas',
        description: 'Las encuestas del chat en vivo, con las barras animándose al votar.',
        accentClass: 'bg-twitch',
        path: '/overlay/polls',
        note: 'Solo Kick',
    },
    status: {
        id: 'status',
        name: 'Estado del stream',
        description: 'Qué plataformas están conectadas y hace cuánto tiempo.',
        accentClass: 'bg-neon-2',
        path: '/overlay/status',
    },
    music: {
        id: 'music',
        name: 'Now Playing',
        description: 'La canción que estás escuchando en Spotify, con portada y progreso.',
        accentClass: 'bg-neon-3',
        path: '/overlay/music',
        note: 'Requiere Spotify',
    },
    screen: {
        id: 'screen',
        name: 'Pantalla de pausa',
        description: 'Pantalla completa con cuenta regresiva y fondo animado para los descansos.',
        accentClass: 'bg-youtube',
        path: '/screen',
    },
    debug: {
        id: 'debug',
        name: 'Herramienta de prueba',
        description: 'Emití eventos falsos para ajustar tus overlays sin esperar a que pasen.',
        accentClass: 'bg-muted',
        path: '/overlay/debug',
    },
} satisfies Record<string, OverlayCatalogEntry>;

/** Orden en el que se muestran en la landing: primero los que más se usan. */
export const OVERLAY_SHOWCASE: OverlayCatalogEntry[] = [
    OVERLAY_CATALOG.chat,
    OVERLAY_CATALOG.alerts,
    OVERLAY_CATALOG.goals,
    OVERLAY_CATALOG.emotes,
    OVERLAY_CATALOG.music,
    OVERLAY_CATALOG.polls,
    OVERLAY_CATALOG.status,
    OVERLAY_CATALOG.screen,
];
