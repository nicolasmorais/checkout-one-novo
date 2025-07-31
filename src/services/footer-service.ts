
"use client";

export interface FooterData {
    securePurchaseTitle: string;
    protectedDataTitle: string;
    companyName: string;
    cnpj: string;
    address: string;
    contactEmail: string;
    copyright: string;
    termsUrl: string;
    privacyUrl: string;
}

const FOOTER_STORAGE_KEY = "firebase-studio-footer";

const DEFAULT_FOOTER_DATA: FooterData = {
    securePurchaseTitle: "Compra Segura",
    protectedDataTitle: "Dados Protegidos",
    companyName: "Mago do CTR Soluções Digitais LTDA",
    cnpj: "12.345.678/0001-99",
    address: "Av. Digital, 123, Sala 4, São Paulo - SP",
    contactEmail: "suporte@magodoctr.com",
    copyright: `© ${new Date().getFullYear()} Mago do CTR. Todos os direitos reservados.`,
    termsUrl: "#",
    privacyUrl: "#",
};

/**
 * Retrieves footer data from localStorage or returns default data.
 * @returns {FooterData}
 */
export function getFooterData(): FooterData {
    if (typeof window === "undefined") {
        return DEFAULT_FOOTER_DATA;
    }
    try {
        const dataJson = window.localStorage.getItem(FOOTER_STORAGE_KEY);
        if (!dataJson) {
            // If no data is stored, store and return the default data
            window.localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(DEFAULT_FOOTER_DATA));
            return DEFAULT_FOOTER_DATA;
        }
        return JSON.parse(dataJson);
    } catch (error) {
        console.error("Failed to retrieve footer data from localStorage", error);
        return DEFAULT_FOOTER_DATA;
    }
}

/**
 * Saves footer data to localStorage.
 * @param {FooterData} data The footer data to save.
 */
export function saveFooterData(data: FooterData): void {
    if (typeof window === "undefined") {
        throw new Error("Cannot save footer data on the server.");
    }
    try {
        window.localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save footer data to localStorage", error);
        throw error;
    }
}
