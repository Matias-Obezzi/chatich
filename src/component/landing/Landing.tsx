'use client';

import React from 'react';
import SiteLayout from '../SiteLayout';
import HeroSection from './HeroSection';
import PlatformsSection from './PlatformsSection';
import DemoSection from './DemoSection';
import UrlBuilder from './UrlBuilder';
import StepsSection from './StepsSection';

export default function Landing({ lang }: { lang: string }) {
    return (
        <SiteLayout lang={lang}>
            <HeroSection lang={lang} />
            <PlatformsSection lang={lang} />
            <DemoSection lang={lang} />
            <UrlBuilder lang={lang} />
            <StepsSection lang={lang} />
        </SiteLayout>
    );
}
