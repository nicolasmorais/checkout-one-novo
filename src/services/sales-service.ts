
"use client";

import { checkPaymentStatus as checkPaymentStatusFlow, CheckPaymentStatusOutput } from "@/ai/flows/check-payment-status-flow";

// Define the structure of a sale object
export interface Sale {
  id: string; // Internal ID for React keys
  transactionId: string; // ID from the payment provider
  name: string;
  email: string;
  product: string;
  amount: string;
  status: "Aprovado" | "Pendente" | "Reembolsado";
  pixCode: string;
  date: Date;
}

const SALES_STORAGE_KEY = "firebase-studio-sales";

// IMPORTANT: This service uses localStorage, which is only available in the browser.
// All data is stored locally on the user's machine and is NOT centralized.
// This is for demonstration purposes as requested. For a real application,
// a proper database (like Firestore) should be used.

/**
 * Retrieves the list of sales from localStorage.
 * Returns an empty array if no sales are found or if not in a browser environment.
 * @returns {Sale[]} An array of sale objects.
 */
export function getSales(): Sale[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const salesJson = window.localStorage.getItem(SALES_STORAGE_KEY);
    if (!salesJson) {
      return [];
    }
    // Dates are stored as strings, so we need to convert them back
    const sales = JSON.parse(salesJson).map((sale: any) => ({
      ...sale,
      date: new Date(sale.date),
    }));
    return sales.sort((a: Sale, b: Sale) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    console.error("Failed to retrieve sales from localStorage", error);
    return [];
  }
}

/**
 * Saves a new sale to the list in localStorage.
 * @param {Sale} newSale The new sale object to save.
 */
export function saveSale(newSale: Sale): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const existingSales = getSales();
    const updatedSales = [newSale, ...existingSales];
    window.localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(updatedSales));
  } catch (error) {
    console.error("Failed to save sale to localStorage", error);
  }
}


/**
 * Updates the status of a specific sale in localStorage.
 * @param {string} transactionId The ID of the transaction to update.
 * @param {Sale['status']} newStatus The new status.
 */
export function updateSaleStatus(transactionId: string, newStatus: Sale['status']): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const existingSales = getSales();
      const updatedSales = existingSales.map(sale => 
        sale.transactionId === transactionId ? { ...sale, status: newStatus } : sale
      );
      window.localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(updatedSales));
    } catch (error) {
      console.error("Failed to update sale status in localStorage", error);
    }
}
  
/**
 * Calls the backend flow to check the payment status.
 * @param {string} transactionId The ID of the transaction to check.
 * @returns {Promise<CheckPaymentStatusOutput | null>}
 */
export async function checkSaleStatus(transactionId: string): Promise<CheckPaymentStatusOutput | null> {
    try {
      return await checkPaymentStatusFlow(transactionId);
    } catch (error) {
      console.error("Error calling checkPaymentStatus flow:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
}
