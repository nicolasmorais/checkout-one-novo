
'use client';

import { useEffect } from 'react';
import { getSiteSettings } from '@/services/site-settings-service';

export default function SiteBranding() {
  useEffect(() => {
    const applyBranding = () => {
      const settings = getSiteSettings();
      
      // Update title
      document.title = settings.siteName;

      // Update favicon
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.faviconUrl || '/favicon.ico';
    };

    applyBranding();

    window.addEventListener('siteSettingsChanged', applyBranding);

    return () => {
      window.removeEventListener('siteSettingsChanged', applyBranding);
    };
  }, []);

  return null; // This component does not render anything
}
