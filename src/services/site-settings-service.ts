
"use client";

export interface SiteSettings {
    siteName: string;
    faviconUrl: string;
    sidebarLogoUrl: string;
}

const SITE_SETTINGS_KEY = "firebase-studio-site-settings";

const DEFAULT_SETTINGS: SiteSettings = {
    siteName: "OneConversion",
    faviconUrl: "/favicon.ico",
    sidebarLogoUrl: "",
};

/**
 * Retrieves site settings from localStorage or returns default data.
 * @returns {SiteSettings}
 */
export function getSiteSettings(): SiteSettings {
    if (typeof window === "undefined") {
        return DEFAULT_SETTINGS;
    }
    try {
        const dataJson = window.localStorage.getItem(SITE_SETTINGS_KEY);
        if (!dataJson) {
            window.localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
            return DEFAULT_SETTINGS;
        }
        return JSON.parse(dataJson);
    } catch (error) {
        console.error("Failed to retrieve site settings from localStorage", error);
        return DEFAULT_SETTINGS;
    }
}

/**
 * Saves site settings to localStorage.
 * @param {SiteSettings} data The settings to save.
 */
export function saveSiteSettings(data: SiteSettings): void {
    if (typeof window === "undefined") {
        throw new Error("Cannot save site settings on the server.");
    }
    try {
        window.localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(data));
        window.dispatchEvent(new Event('siteSettingsChanged'));
    } catch (error) {
        console.error("Failed to save site settings to localStorage", error);
        throw error;
    }
}
