'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from './BrandLogo';

export default function Navbar() {
    const pathname = usePathname();
    const isDocsActive = pathname?.includes('/docs');

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                <Link href="/" className="rounded-xl focus:outline-none focus:ring-2 focus:ring-neon/50">
                    <BrandLogo size={32} showText={true} />
                </Link>

                <div className="flex items-center gap-2 sm:gap-6">
                    <Link
                        href="/docs"
                        className={`text-sm font-medium transition-colors rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-neon/50 ${isDocsActive ? 'text-neon font-bold' : 'text-muted hover:text-neon'}`}
                    >
                        Docs
                    </Link>

                    <Link
                        href="/overlay/chat/builder"
                        className="flex items-center bg-neon/10 border border-neon text-neon px-3 sm:px-4 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap hover:bg-neon hover:text-bg transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)] hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] focus:outline-none focus:ring-2 focus:ring-neon/50"
                    >
                        Abrir builder
                    </Link>
                </div>
            </div>
        </nav>
    );
}
