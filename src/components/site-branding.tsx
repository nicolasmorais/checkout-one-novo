
'use client';

import { useEffect, useState } from 'react';
import { getSiteSettings, SiteSettings } from '@/services/site-settings-service';

export default function SiteBranding() {
  // Initialize with null to indicate data is not yet loaded.
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    // Load settings on the client side.
    setSettings(getSiteSettings());

    const handleSettingsChange = () => {
      setSettings(getSiteSettings());
    };

    window.addEventListener('siteSettingsChanged', handleSettingsChange);
    window.addEventListener('storage', handleSettingsChange);

    return () => {
      window.removeEventListener('siteSettingsChanged', handleSettingsChange);
      window.removeEventListener('storage', handleSettingsChange);
    };
  }, []);

  useEffect(() => {
    // Apply branding only when settings are loaded.
    if (settings) {
      document.title = settings.siteName;

      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.faviconUrl || '/favicon.ico';
    }
  }, [settings]);

  return null; // This component does not render anything.
}
