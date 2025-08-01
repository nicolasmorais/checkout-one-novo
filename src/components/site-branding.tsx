
'use client';

import { useEffect, useState } from 'react';
import { getSiteSettings, SiteSettings } from '@/services/site-settings-service';

export default function SiteBranding() {
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());

  useEffect(() => {
    const applyBranding = () => {
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
  }, [settings]);


  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(getSiteSettings());
    };

    window.addEventListener('siteSettingsChanged', handleSettingsChange);
    // Also check on storage change for cross-tab updates
    window.addEventListener('storage', handleSettingsChange);

    return () => {
      window.removeEventListener('siteSettingsChanged', handleSettingsChange);
      window.removeEventListener('storage', handleSettingsChange);
    };
  }, []);

  return null; // This component does not render anything
}
