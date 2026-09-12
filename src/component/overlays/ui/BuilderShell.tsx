'use client';

import React from 'react';
import { toast } from '@uiness/toast';
import { ChevronUp } from 'lucide-react';
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerDescription,
    DrawerHandle,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/component/ui/drawer';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { useMediaQuery } from './useMediaQuery';

/** Tablero de ajedrez CSS que representa la transparencia del overlay dentro de OBS. */
const CHECKERBOARD: React.CSSProperties = {
    backgroundColor: '#0B0B14',
    backgroundImage: [
        'linear-gradient(45deg, #17172a 25%, transparent 25%)',
        'linear-gradient(-45deg, #17172a 25%, transparent 25%)',
        'linear-gradient(45deg, transparent 75%, #17172a 75%)',
        'linear-gradient(-45deg, transparent 75%, #17172a 75%)',
    ].join(', '),
    backgroundSize: '24px 24px',
    backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0',
};

/** Cuánto tiene que subir el dedo, en px, para que el swipe sobre la barra abra el drawer. */
const SWIPE_OPEN_THRESHOLD = 30;

type BuilderShellProps = {
    /** Contenido del panel de configuración (izquierda en desktop, dentro del drawer en mobile). */
    children: React.ReactNode;
    /** Contenido de la vista previa (derecha en desktop, a pantalla completa en mobile). */
    preview: React.ReactNode;
    /** Botones de simulación que van en la toolbar de la vista previa. */
    previewActions?: React.ReactNode;
    previewLabel?: string;
    /** URL final del overlay, la que se copia a OBS. */
    url: string;
    className?: string;
};

export default function BuilderShell({
    children,
    preview,
    previewActions,
    previewLabel = 'Vista previa',
    url,
    className,
}: BuilderShellProps) {
    // El server asume desktop: antes de hidratar, la rama desktop en viewport angosto cae
    // apilada (flex-col lg:flex-row) y se ve razonable, mientras que la rama mobile en una
    // pantalla ancha muestra la barra fija a todo lo ancho y se ve rota.
    const isDesktop = useMediaQuery('(min-width: 1024px)', true);
    const [open, setOpen] = React.useState(false);
    const touchStartYRef = React.useRef<number | null>(null);

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('URL copiada al portapapeles');
        } catch {
            toast.error('Error al copiar URL');
        }
    };

    const handleBarTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const handleBarTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
        const startY = touchStartYRef.current;
        if (startY === null) return;
        const currentY = e.touches[0]?.clientY;
        if (currentY !== undefined && startY - currentY > SWIPE_OPEN_THRESHOLD) {
            setOpen(true);
            touchStartYRef.current = null;
        }
    };

    const previewToolbar = (
        <div className="bg-surface-2 border-b border-border px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-semibold text-text">{previewLabel}</span>
            {previewActions && <div className="flex flex-wrap gap-2">{previewActions}</div>}
        </div>
    );

    if (isDesktop) {
        return (
            <div className={`w-full flex flex-col lg:flex-row items-start gap-6 ${className ?? ''}`}>
                {/* Panel de configuración */}
                <div className="w-full lg:w-1/3 bg-surface border border-border rounded-xl p-6 flex flex-col gap-6">
                    <div className="space-y-6 flex-grow">{children}</div>
                    <ObsExport url={url} onCopy={copyUrl} />
                </div>

                {/* Vista previa */}
                {/* Alto definido (no max-h): los previews son `absolute inset-0` y no aportan alto,
                    así que sin una altura concreta el área de vista previa colapsa a 0. */}
                <div className="w-full lg:w-2/3 rounded-xl border border-border overflow-hidden flex flex-col h-[500px] lg:h-[calc(100vh-6rem)] lg:sticky lg:top-20">
                    {previewToolbar}
                    <div className="flex-1 relative min-h-0" style={CHECKERBOARD}>
                        {preview}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full pb-20 ${className ?? ''}`}>
            {/* Vista previa a pantalla completa: la configuración se abre desde la barra de abajo. */}
            <div className="w-full rounded-xl border border-border overflow-hidden flex flex-col h-[calc(100dvh-13rem)] min-h-[360px]">
                {previewToolbar}
                <div className="flex-1 relative min-h-0" style={CHECKERBOARD}>
                    {preview}
                </div>
            </div>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <button
                        type="button"
                        onTouchStart={handleBarTouchStart}
                        onTouchMove={handleBarTouchMove}
                        className="fixed inset-x-0 bottom-0 z-40 lg:hidden flex flex-col items-center gap-1.5 bg-surface border-t border-border pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
                    >
                        <span className="h-1.5 w-12 rounded-full bg-border" aria-hidden="true" />
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-text">
                            Personalizá tu overlay
                            <ChevronUp className="w-4 h-4 text-muted" aria-hidden="true" />
                        </span>
                    </button>
                </DrawerTrigger>
                <DrawerContent
                    side="bottom"
                    snapPoints={[0.6, 0.92]}
                    defaultSnapPoint={0}
                    handle={false}
                    className="border-border"
                >
                    <DrawerHandle />
                    <DrawerHeader>
                        <DrawerTitle>Personalizá tu overlay</DrawerTitle>
                        <DrawerDescription>Ajustá las opciones y copiá la URL para usar en OBS.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerBody className="pb-6">
                        <div className="space-y-6">{children}</div>
                        <ObsExport url={url} onCopy={copyUrl} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

/** Bloque para exportar la URL del overlay a OBS: input readonly, botón de copiar y ayuda. */
function ObsExport({ url, onCopy }: { url: string; onCopy: () => void }) {
    return (
        <div className="pt-4 border-t border-border space-y-2">
            <Input
                type="text"
                readOnly
                value={url}
                onFocus={(e) => e.currentTarget.select()}
                aria-label="URL del overlay"
                className="text-muted text-xs font-mono"
            />
            <Button type="button" onClick={onCopy} className="w-full font-bold">
                Copiar URL para OBS
            </Button>
            <p className="text-xs text-muted">
                Agregá una fuente de navegador en OBS con esta URL (1920x1080).
            </p>
        </div>
    );
}

/** Botón de simulación para la toolbar de la vista previa. */
export function PreviewButton({
    children,
    onClick,
    className,
}: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}) {
    return (
        <Button type="button" variant="outline" size="sm" onClick={onClick} className={className}>
            {children}
        </Button>
    );
}
