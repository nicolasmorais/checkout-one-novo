
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
  pixCode: z
    .string()
    .describe('The PIX code for the payment.'),
  qrCode: z
    .string()
    .describe(
      "A QR code image for the payment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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
    // In a real application, you would integrate with a payment gateway provider here.
    // For this example, we will return a simulated PIX code and a placeholder QR code.
    
    console.log(`Creating payment for ${input.name} (${input.email})`);

    const pixCode = "00020126360014br.gov.bcb.pix0114+551199999999952040000530398654059.905802BR5925Mago do CTR Solucoes Digita6009SAO PAULO62070503***6304E4A5";
    const qrCode = "https://placehold.co/256x256.png"; // Placeholder QR code

    return {
      pixCode,
      qrCode,
    };
  }
);
