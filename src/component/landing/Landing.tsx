'use client';

import React from 'react';
import SiteLayout from '../SiteLayout';
import HeroSection from './HeroSection';
import PlatformsSection from './PlatformsSection';
import OverlaysSection from './OverlaysSection';
import DemoSection from './DemoSection';
import StepsSection from './StepsSection';
import CtaSection from './CtaSection';

export default function Landing({ lang }: { lang: string }) {
    return (
        <SiteLayout lang={lang}>
            <HeroSection lang={lang} />
            <OverlaysSection lang={lang} />
            <PlatformsSection lang={lang} />
            <DemoSection lang={lang} />
            <StepsSection lang={lang} />
            <CtaSection lang={lang} />
        </SiteLayout>
    );
}
