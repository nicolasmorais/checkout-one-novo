
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { getMarketingScripts, MarketingScripts as Scripts } from '@/services/marketing-service';
import * as fbq from '@/lib/fpixel';

interface MarketingScriptsProps {
    location: 'head' | 'body';
}

export default function MarketingScripts({ location }: MarketingScriptsProps) {
    const [scripts, setScripts] = useState<Scripts | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const loadScripts = () => {
            const loadedScripts = getMarketingScripts();
            setScripts(loadedScripts);
            if (loadedScripts.facebook_pixel_id) {
                fbq.init(loadedScripts.facebook_pixel_id);
            }
        };
        
        loadScripts();
        window.addEventListener('marketingScriptsUpdated', loadScripts);
        return () => window.removeEventListener('marketingScriptsUpdated', loadScripts);
    }, []);

    useEffect(() => {
        if (!scripts?.facebook_pixel_id) return;
        fbq.pageview();
    }, [pathname, searchParams, scripts?.facebook_pixel_id]);

    if (!scripts) return null;

    if (location === 'head') {
        return (
            <>
                {scripts.gtm_head && <script dangerouslySetInnerHTML={{ __html: scripts.gtm_head }} />}
                {scripts.facebook_pixel_id && (
                     <Script
                        id="fb-pixel"
                        strategy="afterInteractive"
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
                            fbq('init', '${scripts.facebook_pixel_id}');
                            fbq('track', 'PageView');
                        `,
                        }}
                    />
                )}
            </>
        );
    }
    
    if (location === 'body' && scripts.gtm_body) {
        return <div dangerouslySetInnerHTML={{ __html: scripts.gtm_body }} />;
    }

    return null;
}
