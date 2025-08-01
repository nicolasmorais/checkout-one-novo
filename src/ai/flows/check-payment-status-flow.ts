
'use server';
/**
 * @fileOverview A flow to handle payment status checks via Push In Pay.
 *
 * - checkPaymentStatus - A function that handles the payment status check process.
 * - CheckPaymentStatusOutput - The return type for the checkPaymentStatus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { updateSaleStatus } from '@/services/sales-service';

const CheckPaymentStatusOutputSchema = z.object({
    status: z.string().describe('The current status of the transaction (e.g., Aprovado, Pendente).'),
});
export type CheckPaymentStatusOutput = z.infer<typeof CheckPaymentStatusOutputSchema>;

export async function checkPaymentStatus(transactionId: string): Promise<CheckPaymentStatusOutput | null> {
    return checkPaymentStatusFlow(transactionId);
}

const checkPaymentStatusFlow = ai.defineFlow(
    {
        name: 'checkPaymentStatusFlow',
        inputSchema: z.string(),
        outputSchema: CheckPaymentStatusOutputSchema.nullable(),
    },
    async (transactionId) => {
        console.log(`[PIX] Consultando status da transação ${transactionId}`);

        const PUSHINPAY_API_URL = `https://api.pushinpay.com.br/api/transactions/${transactionId}`;
        const API_TOKEN = process.env.PUSHINPAY_API_TOKEN;

        if (!API_TOKEN) {
            throw new Error("Push In Pay API token não está configurado.");
        }

        try {
            const response = await fetch(PUSHINPAY_API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (response.status === 404) {
                console.warn(`[PIX] Transação ${transactionId} não encontrada (404).`);
                return null;
            }

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Erro ao consultar status da transação. Código: ${response.status}. Detalhes: ${errorBody}`);
            }

            const data = await response.json();

            const status = data.status === 'approved' ? 'Aprovado' : 'Pendente';

            if (status === 'Aprovado') {
                // Atualiza o status da venda no banco de dados
                await updateSaleStatus(transactionId, status);
            }

            return { status };

        } catch (error) {
            console.error("[PIX] Falha na verificação do status do pagamento:", error);
            throw new Error("Erro ao verificar status do pagamento PIX.");
        }
    }
);
