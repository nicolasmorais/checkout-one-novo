
'use client';

import { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { getMarketingScripts, MarketingScripts as Scripts } from '@/services/marketing-service';
import * as fbq from '@/lib/fpixel';

interface MarketingScriptsProps {
    location: 'head' | 'body';
}

function MarketingScriptsContent({ location }: MarketingScriptsProps) {
    const [scripts, setScripts] = useState<Scripts | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const loadScripts = () => {
            setScripts(getMarketingScripts());
        };
        
        loadScripts();
        window.addEventListener('marketingScriptsUpdated', loadScripts);
        return () => window.removeEventListener('marketingScriptsUpdated', loadScripts);
    }, []);

    // Track PageView on route change
    useEffect(() => {
        if (scripts?.facebook_pixel_id) {
          fbq.pageview();
        }
    }, [pathname, searchParams, scripts?.facebook_pixel_id]);

    if (!scripts) return null;

    const GTMHead = () => (
        scripts.gtm_head ? <script dangerouslySetInnerHTML={{ __html: scripts.gtm_head }} /> : null
    );

    const FBPixel = () => (
        scripts.facebook_pixel_id ? (
            <Script
                id="fb-pixel-base"
                strategy="afterInteractive"
                onLoad={() => {
                    if (scripts.facebook_pixel_id) {
                        fbq.init(scripts.facebook_pixel_id);
                    }
                }}
                dangerouslySetInnerHTML={{
                __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                `,
                }}
            />
        ) : null
    );

    const GTMBody = () => (
        scripts.gtm_body ? <noscript dangerouslySetInnerHTML={{ __html: scripts.gtm_body }} /> : null
    );

    if (location === 'head') {
        return (
            <>
                <GTMHead />
                <FBPixel />
            </>
        );
    }
    
    if (location === 'body') {
        return <GTMBody />;
    }

    return null;
}

export default function MarketingScripts(props: MarketingScriptsProps) {
    return (
        <Suspense fallback={null}>
            <MarketingScriptsContent {...props} />
        </Suspense>
    )
}
