
'use client';

import { useState, useEffect } from 'react';
import { getMarketingScripts, MarketingScripts as Scripts } from '@/services/marketing-service';
import Head from 'next/head';

interface MarketingScriptsProps {
    location: 'head' | 'body';
}

// This component is tricky because scripts need to be inserted as raw HTML.
// We use dangerouslySetInnerHTML for this, which is safe here because
// the content comes from a trusted admin panel.
export default function MarketingScripts({ location }: MarketingScriptsProps) {
    const [scripts, setScripts] = useState<Scripts | null>(null);

    useEffect(() => {
        const loadScripts = () => {
            setScripts(getMarketingScripts());
        };
        
        loadScripts();

        // Listen for updates from the marketing page to force a re-render
        window.addEventListener('marketingScriptsUpdated', loadScripts);

        return () => {
            window.removeEventListener('marketingScriptsUpdated', loadScripts);
        };
    }, []);

    if (!scripts) {
        return null;
    }

    if (location === 'head' && scripts.gtm_head) {
        return (
            <Head>
                <script dangerouslySetInnerHTML={{ __html: scripts.gtm_head }} />
            </Head>
        );
    }
    
    if (location === 'body' && scripts.gtm_body) {
         // Using a standard div for the body script as it's typically a <noscript> iframe.
        return <div dangerouslySetInnerHTML={{ __html: scripts.gtm_body }} />;
    }

    return null;
}
