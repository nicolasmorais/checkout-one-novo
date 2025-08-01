
'use server';
/**
 * @fileOverview A function to handle payment creation by calling the PushInPay API.
 */

import { z } from 'zod';

const CreatePaymentInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  email: z.string().email().describe('The email of the user.'),
  valueInCents: z.number().int().positive().describe('The value of the product in cents.'),
});
export type CreatePaymentInput = z.infer<typeof CreatePaymentInputSchema>;

const CreatePaymentOutputSchema = z.object({
  transactionId: z.string().describe('The unique ID for the transaction.'),
  pixCode: z.string().describe('The PIX code for the payment.'),
  qrCode: z.string().describe("A QR code image for the payment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"),
});
export type CreatePaymentOutput = z.infer<typeof CreatePaymentOutputSchema>;


export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
  const validatedInput = CreatePaymentInputSchema.parse(input);

  console.log(`Creating payment for ${validatedInput.name} via PushInPay...`);

  const PUSHINPAY_API_URL = "https://api.pushinpay.com.br/api/pix/cashIn";
  const API_TOKEN = process.env.PUSHINPAY_API_TOKEN;

  if (!API_TOKEN) {
    throw new Error("PUSHINPAY_API_TOKEN is not configured in environment variables.");
  }

  try {
    const response = await fetch(PUSHINPAY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: validatedInput.valueInCents,
        webhook_url: "https://example.com/webhook-pix", // This should be a real endpoint in the future
        "split_rules": []
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`PushInPay API Error: ${errorBody}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    const result = {
      transactionId: data.id,
      pixCode: data.qr_code,
      qrCode: data.qr_code_base64,
    };
    
    return CreatePaymentOutputSchema.parse(result);

  } catch (error) {
    console.error("Error creating Push In Pay payment:", error);
    throw new Error("Failed to create PIX payment.");
  }
}
