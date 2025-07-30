
'use client';

import { useEffect } from 'react';

// Helper function to convert hex to HSL string
function hexToHsl(hex: string): string | null {
    if (!hex || !hex.startsWith('#')) return null;
  
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length == 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    // 6 digits
    } else if (hex.length == 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    } else {
        return null;
    }
  
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
  
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
  
    return `${h} ${s}% ${l}%`;
}
  

const PRIMARY_COLOR_STORAGE_KEY = "theme_primary_color_hex";

export default function ThemeUpdater() {
  useEffect(() => {
    const applyTheme = () => {
      const savedColor = localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY);
      if (savedColor) {
        const hslColor = hexToHsl(savedColor);
        if (hslColor) {
          document.documentElement.style.setProperty('--primary', hslColor);
        }
      }
    };

    applyTheme();

    // Listen for changes from the personalization page
    window.addEventListener('storage', applyTheme);
    window.addEventListener('themeChanged', applyTheme);


    return () => {
      window.removeEventListener('storage', applyTheme);
      window.removeEventListener('themeChanged', applyTheme);
    };
  }, []);

  return null; // This component does not render anything
}
