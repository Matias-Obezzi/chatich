'use client';

/**
 * Spotify con Authorization Code + PKCE, enteramente del lado del cliente.
 *
 * Por qué PKCE y no el flujo con client secret: el token se obtiene y se guarda en el
 * navegador, así que no hay dónde esconder un secret. PKCE está diseñado justamente para
 * clientes públicos y no necesita ninguno.
 *
 * Los tokens viven en localStorage. Ojo con la consecuencia: el browser source de OBS es un
 * navegador aparte con su propio almacenamiento, así que autorizar en Chrome NO sirve para
 * el overlay. Hay que autorizar desde adentro de OBS ("Interactuar"), y si se limpia la
 * caché de esa fuente la autorización se pierde.
 */

const STORAGE_KEY = 'chatich_spotify_tokens';
const VERIFIER_KEY = 'chatich_spotify_verifier';
const AUTH_HOST = 'https://accounts.spotify.com';
const API_HOST = 'https://api.spotify.com/v1';

/** Solo lectura de la reproducción: es todo lo que el overlay necesita. */
const SCOPES = ['user-read-currently-playing', 'user-read-playback-state'];

export type SpotifyTokens = {
    accessToken: string;
    refreshToken: string;
    /** Epoch en ms en el que vence el access token. */
    expiresAt: number;
};

export type NowPlaying = {
    isPlaying: boolean;
    title: string;
    artists: string;
    album: string;
    albumArt?: string;
    /** Posición actual en ms. */
    progressMs: number;
    /** Duración total en ms. */
    durationMs: number;
    url?: string;
};

export function getClientId(): string | undefined {
    return process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
}

export function getRedirectUri(): string {
    return `${window.location.origin}/spotify/callback`;
}

// --- almacenamiento ---------------------------------------------------------

export function readTokens(): SpotifyTokens | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as SpotifyTokens;
        if (!parsed.accessToken || !parsed.refreshToken) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function writeTokens(tokens: SpotifyTokens): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function clearTokens(): void {
    localStorage.removeItem(STORAGE_KEY);
}

// --- PKCE -------------------------------------------------------------------

function base64UrlEncode(bytes: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(bytes)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function randomVerifier(): string {
    const bytes = new Uint8Array(64);
    crypto.getRandomValues(bytes);
    return base64UrlEncode(bytes.buffer);
}

async function challengeFor(verifier: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    return base64UrlEncode(digest);
}

/**
 * Arranca el flujo: guarda el verifier y devuelve la URL de autorización de Spotify.
 * El verifier queda en localStorage porque tiene que sobrevivir a la vuelta del redirect.
 */
export async function buildAuthorizeUrl(): Promise<string> {
    const clientId = getClientId();
    if (!clientId) throw new Error('Falta NEXT_PUBLIC_SPOTIFY_CLIENT_ID');

    const verifier = randomVerifier();
    localStorage.setItem(VERIFIER_KEY, verifier);

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: getRedirectUri(),
        code_challenge_method: 'S256',
        code_challenge: await challengeFor(verifier),
        scope: SCOPES.join(' '),
    });

    return `${AUTH_HOST}/authorize?${params.toString()}`;
}

type TokenResponse = {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
};

function toTokens(response: TokenResponse, previousRefresh?: string): SpotifyTokens {
    const refreshToken = response.refresh_token ?? previousRefresh;
    if (!refreshToken) throw new Error('Spotify no devolvió refresh token');
    return {
        accessToken: response.access_token,
        refreshToken,
        // Un margen de 60s para no usar un token que vence mientras viaja el request.
        expiresAt: Date.now() + (response.expires_in - 60) * 1000,
    };
}

/** Cierra el flujo: canjea el `code` del redirect por tokens y los persiste. */
export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
    const clientId = getClientId();
    if (!clientId) throw new Error('Falta NEXT_PUBLIC_SPOTIFY_CLIENT_ID');

    const verifier = localStorage.getItem(VERIFIER_KEY);
    if (!verifier) throw new Error('No se encontró el code verifier; volvé a iniciar la conexión');

    const response = await fetch(`${AUTH_HOST}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: getRedirectUri(),
            client_id: clientId,
            code_verifier: verifier,
        }),
    });

    if (!response.ok) throw new Error(`Spotify rechazó el canje (${response.status})`);

    const tokens = toTokens((await response.json()) as TokenResponse);
    localStorage.removeItem(VERIFIER_KEY);
    writeTokens(tokens);
    return tokens;
}

/**
 * Renueva el access token. Importante: en PKCE el refresh token ROTA, Spotify devuelve uno
 * nuevo en cada renovación, así que hay que persistir el que vuelve o la próxima falla.
 */
async function refreshTokens(tokens: SpotifyTokens): Promise<SpotifyTokens> {
    const clientId = getClientId();
    if (!clientId) throw new Error('Falta NEXT_PUBLIC_SPOTIFY_CLIENT_ID');

    const response = await fetch(`${AUTH_HOST}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: tokens.refreshToken,
            client_id: clientId,
        }),
    });

    if (!response.ok) {
        // Un refresh token revocado no se recupera solo: hay que volver a autorizar.
        if (response.status === 400 || response.status === 401) clearTokens();
        throw new Error(`No se pudo renovar el token de Spotify (${response.status})`);
    }

    const next = toTokens((await response.json()) as TokenResponse, tokens.refreshToken);
    writeTokens(next);
    return next;
}

/** Devuelve un access token válido, renovándolo si hace falta. */
export async function getValidAccessToken(): Promise<string | null> {
    const tokens = readTokens();
    if (!tokens) return null;
    if (Date.now() < tokens.expiresAt) return tokens.accessToken;
    try {
        return (await refreshTokens(tokens)).accessToken;
    } catch {
        return null;
    }
}

type CurrentlyPlayingResponse = {
    is_playing: boolean;
    progress_ms: number | null;
    item: {
        name: string;
        duration_ms: number;
        external_urls?: { spotify?: string };
        album: { name: string; images: Array<{ url: string }> };
        artists: Array<{ name: string }>;
    } | null;
};

/**
 * Canción actual. Devuelve null cuando no hay nada sonando (Spotify contesta 204) o cuando
 * todavía no hay autorización.
 */
export async function fetchNowPlaying(): Promise<NowPlaying | null> {
    const accessToken = await getValidAccessToken();
    if (!accessToken) return null;

    const response = await fetch(`${API_HOST}/me/player/currently-playing`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
    });

    // 204: no hay reproducción activa. 429: nos pasamos de rate limit, reintentamos después.
    if (response.status === 204 || response.status === 429 || !response.ok) return null;

    const data = (await response.json()) as CurrentlyPlayingResponse;
    if (!data.item) return null;

    return {
        isPlaying: data.is_playing,
        title: data.item.name,
        artists: data.item.artists.map((artist) => artist.name).join(', '),
        album: data.item.album.name,
        albumArt: data.item.album.images[0]?.url,
        progressMs: data.progress_ms ?? 0,
        durationMs: data.item.duration_ms,
        url: data.item.external_urls?.spotify,
    };
}
