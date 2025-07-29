
'use server';
/**
 * @fileOverview A flow to handle payment creation.
 *
 * - createPayment - A function that handles the payment creation process.
 * - CreatePaymentInput - The input type for the createPayment function.
 * - CreatePaymentOutput - The return type for the createPayment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CreatePaymentInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  email: z.string().email().describe('The email of the user.'),
});
export type CreatePaymentInput = z.infer<typeof CreatePaymentInputSchema>;

const CreatePaymentOutputSchema = z.object({
  transactionId: z.string().describe('The unique ID for the transaction.'),
  pixCode: z
    .string()
    .describe('The PIX code for the payment.'),
  qrCode: z
    .string()
    .describe(
      "A QR code image for the payment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type CreatePaymentOutput = z.infer<typeof CreatePaymentOutputSchema>;

// This is the exported function that the frontend will call.
export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
  return createPaymentFlow(input);
}


// This is the Genkit flow that defines the backend logic.
const createPaymentFlow = ai.defineFlow(
  {
    name: 'createPaymentFlow',
    inputSchema: CreatePaymentInputSchema,
    outputSchema: CreatePaymentOutputSchema,
  },
  async (input) => {
    console.log(`Creating payment for ${input.name} (${input.email})`);
    
    const PUSHINPAY_API_URL = "https://api.pushinpay.com.br/api/pix/cashIn";
    const API_TOKEN = process.env.PUSHINPAY_API_TOKEN;

    if (!API_TOKEN) {
      throw new Error("Push In Pay API token is not configured.");
    }
    
    const productValueInCents = 990; // R$ 9,90

    try {
      const response = await fetch(PUSHINPAY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: productValueInCents,
          webhook_url: "https://seudominio.com/webhook-pix", // Example webhook
          "split_rules": []
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
      }

      const data = await response.json();

      return {
        transactionId: data.id,
        pixCode: data.qr_code,
        qrCode: data.qr_code_base64,
      };

    } catch (error) {
      console.error("Error creating Push In Pay payment:", error);
      throw new Error("Failed to create PIX payment.");
    }
  }
);
