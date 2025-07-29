
'use server';
/**
 * @fileOverview A flow to handle payment status checks.
 *
 * - checkPaymentStatus - A function that handles the payment status check process.
 * - CheckPaymentStatusOutput - The return type for the checkPaymentStatus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CheckPaymentStatusOutputSchema = z.object({
    status: z.string().describe('The current status of the transaction.'),
});
export type CheckPaymentStatusOutput = z.infer<typeof CheckPaymentStatusOutputSchema>;


// This is the exported function that the frontend will call.
export async function checkPaymentStatus(transactionId: string): Promise<CheckPaymentStatusOutput | null> {
    return checkPaymentStatusFlow(transactionId);
}

// This is the Genkit flow that defines the backend logic.
const checkPaymentStatusFlow = ai.defineFlow(
    {
        name: 'checkPaymentStatusFlow',
        inputSchema: z.string(),
        outputSchema: CheckPaymentStatusOutputSchema.nullable(),
    },
    async (transactionId) => {
        console.log(`Checking payment status for transaction ${transactionId}`);

        const PUSHINPAY_API_URL = `https://api.pushinpay.com.br/api/transactions/${transactionId}`;
        const API_TOKEN = process.env.PUSHINPAY_API_TOKEN;

        if (!API_TOKEN) {
            throw new Error("Push In Pay API token is not configured.");
        }

        try {
            const response = await fetch(PUSHINPAY_API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                redirect: 'follow'
            });

            if (response.status === 404) {
                console.log(`Transaction ${transactionId} not found.`);
                return null;
            }

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
            }

            const data = await response.json();
            
            // The API returns the full transaction object. We are interested in the status.
            // The documentation says the status for a paid transaction is "approved".
            return {
                status: data.status === 'approved' ? 'Aprovado' : 'Pendente',
            };

        } catch (error) {
            console.error("Error checking Push In Pay payment status:", error);
            throw new Error("Failed to check PIX payment status.");
        }
    }
);
