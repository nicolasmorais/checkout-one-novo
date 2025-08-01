
"use client";

export interface CheckoutSettings {
    showAlert: boolean;
    alertMessage: string;
}

const CHECKOUT_SETTINGS_KEY = "firebase-studio-checkout-settings";

const DEFAULT_SETTINGS: CheckoutSettings = {
    showAlert: true,
    alertMessage: "⚠️ Atenção: O não pagamento do Pix pode gerar uma negativação no Serasa e SPC.",
};

/**
 * Retrieves checkout settings from localStorage or returns default data.
 * @returns {CheckoutSettings}
 */
export function getCheckoutSettings(): CheckoutSettings {
    if (typeof window === "undefined") {
        return DEFAULT_SETTINGS;
    }
    try {
        const dataJson = window.localStorage.getItem(CHECKOUT_SETTINGS_KEY);
        if (!dataJson) {
            window.localStorage.setItem(CHECKOUT_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
            return DEFAULT_SETTINGS;
        }
        return JSON.parse(dataJson);
    } catch (error) {
        console.error("Failed to retrieve checkout settings from localStorage", error);
        return DEFAULT_SETTINGS;
    }
}

/**
 * Saves checkout settings to localStorage.
 * @param {CheckoutSettings} data The settings to save.
 */
export function saveCheckoutSettings(data: CheckoutSettings): void {
    if (typeof window === "undefined") {
        throw new Error("Cannot save checkout settings on the server.");
    }
    try {
        window.localStorage.setItem(CHECKOUT_SETTINGS_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save checkout settings to localStorage", error);
        throw error;
    }
}
