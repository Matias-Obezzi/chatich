'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/component/ui/reveal';
import { OVERLAY_SHOWCASE } from '@/component/overlays/catalog';
import { useTranslations } from './i18n';

export default function OverlaysSection({ lang }: { lang: string }) {
    const t = useTranslations(lang);

    return (
        <section className="py-24 bg-bg">
            <div className="max-w-6xl mx-auto px-4">
                <Reveal className="text-center mb-14">
                    <h2 className="font-chakra text-4xl md:text-5xl font-bold mb-4">{t.overlaysTitle}</h2>
                    <p className="text-xl text-muted max-w-2xl mx-auto">{t.overlaysDesc}</p>
                </Reveal>

                <Reveal stagger={70} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {OVERLAY_SHOWCASE.map((overlay) => (
                        <Link
                            key={overlay.id}
                            href={`/overlay/${overlay.id}/builder`}
                            aria-label={`${t.overlaysCta}: ${overlay.name}`}
                            className="group relative bg-surface border border-border rounded-xl p-5 flex flex-col gap-2 overflow-hidden transition-colors hover:border-neon/50 focus:outline-none focus:ring-2 focus:ring-neon/50"
                        >
                            <span
                                className={`absolute top-0 left-0 h-1 w-full ${overlay.accentClass} opacity-60 group-hover:opacity-100 transition-opacity`}
                                aria-hidden="true"
                            />
                            <h3 className="font-chakra text-lg font-bold text-text">{overlay.name}</h3>
                            <p className="text-sm text-muted leading-relaxed flex-grow">{overlay.description}</p>
                            <div className="flex items-center justify-between gap-2 mt-1">
                                {/* Una flecha en vez del texto "Abrir builder": con el badge al lado
                                    el texto caía en dos líneas. */}
                                <ArrowRight
                                    className="w-4 h-4 text-muted transition-all group-hover:text-neon group-hover:translate-x-1"
                                    aria-hidden="true"
                                />
                                {overlay.note && (
                                    <span className="text-[10px] uppercase tracking-wider text-muted border border-border rounded-full px-2 py-0.5 whitespace-nowrap shrink-0">
                                        {overlay.note}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
