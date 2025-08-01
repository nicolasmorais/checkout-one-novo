
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

/**
 * Mapeia o status da API para o status interno da aplicação.
 * @param apiStatus O status retornado pela API da PushInPay.
 * @returns O status traduzido para a aplicação.
 */
const translateStatus = (apiStatus: string): string => {
    const statusMap: { [key: string]: string } = {
        'paid': 'Aprovado',
        'approved': 'Aprovado',
        'refused': 'Recusado',
        'pending': 'Pendente',
        'in_process': 'Pendente',
        'expired': 'Expirado',
        'refunded': 'Reembolsado',
        'chargeback': 'Reembolsado',
    };
    return statusMap[apiStatus.toLowerCase()] || 'Pendente';
};


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
            console.error("[PIX] Push In Pay API token não está configurado.");
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
                console.error(`[PIX] Erro ao consultar API. Status: ${response.status}. Body: ${errorBody}`);
                throw new Error(`Erro ao consultar status da transação. Código: ${response.status}.`);
            }

            const data = await response.json();
            console.log(`[PIX] Resposta da API para transação ${transactionId}:`, JSON.stringify(data, null, 2));


            if (!data.status) {
                console.warn(`[PIX] Resposta da API não contém um campo 'status'.`, data);
                return { status: 'Pendente' };
            }

            // Traduz o status da API para o status da aplicação
            const status = translateStatus(data.status);
            console.log(`[PIX] Status da API: '${data.status}', Status traduzido: '${status}'`);

            // Atualiza o status da venda no banco de dados com o status correto
            await updateSaleStatus(transactionId, status);

            return { status };

        } catch (error) {
            console.error(`[PIX] Falha na verificação do status do pagamento para a transação ${transactionId}:`, error);
            // Lançar o erro novamente para que o front-end possa capturá-lo
            throw error;
        }
    }
);
