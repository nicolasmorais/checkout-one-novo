
"use client";

export interface MarketingScripts {
    gtm_head?: string;
    gtm_body?: string;
    facebook_pixel_id?: string;
}

const MARKETING_SCRIPTS_STORAGE_KEY = "firebase-studio-marketing-scripts";

const DEFAULT_SCRIPTS: MarketingScripts = {
    gtm_head: "",
    gtm_body: "",
    facebook_pixel_id: "",
};

/**
 * Retrieves marketing scripts from localStorage or returns default data.
 * @returns {MarketingScripts}
 */
export function getMarketingScripts(): MarketingScripts {
    if (typeof window === "undefined") {
        return DEFAULT_SCRIPTS;
    }
    try {
        const dataJson = window.localStorage.getItem(MARKETING_SCRIPTS_STORAGE_KEY);
        return dataJson ? JSON.parse(dataJson) : DEFAULT_SCRIPTS;
    } catch (error) {
        console.error("Failed to retrieve marketing scripts from localStorage", error);
        return DEFAULT_SCRIPTS;
    }
}

/**
 * Saves marketing scripts to localStorage.
 * @param {MarketingScripts} data The scripts to save.
 */
export function saveMarketingScripts(data: MarketingScripts): void {
    if (typeof window === "undefined") {
        throw new Error("Cannot save marketing scripts on the server.");
    }
    try {
        const dataToSave = {
            gtm_head: data.gtm_head || "",
            gtm_body: data.gtm_body || "",
            facebook_pixel_id: data.facebook_pixel_id || "",
        };
        window.localStorage.setItem(MARKETING_SCRIPTS_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
        console.error("Failed to save marketing scripts to localStorage", error);
        throw error;
    }
}
