'use client';

import React, { Suspense } from 'react';
import { Toaster } from '@uiness/toast';
import Navbar from './Navbar';
import Footer from './Footer';

type SiteLayoutProps = {
    children: React.ReactNode;
    /** Idioma para el Footer. Si no viene, el Footer lo resuelve por la URL. */
    lang?: string;
    /** Clases del <main>. Por defecto ocupa el alto disponible. */
    mainClassName?: string;
    /** Contenido entre el Navbar y el <main> (ej: la barra de pestañas de los builders). */
    beforeMain?: React.ReactNode;
    className?: string;
};

export default function SiteLayout({ children, lang, mainClassName, beforeMain, className }: SiteLayoutProps) {
    return (
        <div className={`w-full min-h-screen bg-bg text-text font-inter flex flex-col selection:bg-neon selection:text-bg ${className ?? ''}`}>
            <Suspense fallback={<div className="h-16 border-b border-border bg-bg/80" />}>
                <Navbar />
            </Suspense>

            {beforeMain}

            <main className={mainClassName ?? 'flex-grow flex flex-col'}>
                {children}
            </main>

            <Suspense fallback={<div className="h-32 border-t border-border bg-surface-2" />}>
                <Footer lang={lang} />
            </Suspense>

            <Toaster position="bottom-right" richColors />
        </div>
    );
}
