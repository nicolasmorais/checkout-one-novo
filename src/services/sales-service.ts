
'use server';

import { db } from '@vercel/postgres';

export interface Sale {
  id: number;
  transaction_id: string;
  customer_name: string;
  customer_email: string;
  product_name: string;
  amount_in_cents: number;
  status: string;
  pix_code?: string;
  sale_date: string;
}

export async function saveSale(sale: Omit<Sale, 'id' | 'sale_date'>) {
    const client = await db.connect();
  try {
    // await db.connect(); // connect() is often not needed with modern Vercel Postgres clients
    await client.sql`
      INSERT INTO sales (
        transaction_id, 
        customer_name, 
        customer_email, 
        product_name, 
        amount_in_cents, 
        status, 
        pix_code
      ) VALUES (
        ${sale.transaction_id}, 
        ${sale.customer_name}, 
        ${sale.customer_email}, 
        ${sale.product_name}, 
        ${sale.amount_in_cents}, 
        ${sale.status}, 
        ${sale.pix_code}
      );
    `;
    console.log('Sale saved successfully to Vercel Postgres');
  } catch (error) {
    console.error('Error saving sale to Vercel Postgres:', error);
    throw error;
  } finally {
      client.release();
  }
}

/**
 * Retrieves all sales from the database.
 * @returns {Promise<Sale[]>} A promise that resolves to an array of sales.
 */
export async function getSales(): Promise<Sale[]> {
    const client = await db.connect();
    try {
        const { rows } = await client.sql`SELECT 
          id, 
          transaction_id, 
          customer_name, 
          customer_email, 
          product_name, 
          amount_in_cents, 
          status, 
          pix_code,
          sale_date::text
        FROM sales ORDER BY sale_date DESC;`;
        return rows as Sale[];
    } catch (error) {
        console.error('Error fetching sales from Vercel Postgres:', error);
        throw error;
    } finally {
        client.release();
    }
}


/**
 * Updates the status of a specific sale in the database.
 * @param transactionId The ID of the transaction to update.
 * @param newStatus The new status to set.
 * @returns {Promise<Sale[]>} A promise that resolves to the updated list of all sales.
 */
export async function updateSaleStatus(transactionId: string, newStatus: string): Promise<Sale[]> {
    const client = await db.connect();
    try {
        await client.sql`
            UPDATE sales
            SET status = ${newStatus}
            WHERE transaction_id = ${transactionId};
        `;
        console.log(`Sale status updated for transaction ${transactionId}`);
        // Return the full updated list of sales
        return await getSales();
    } catch (error) {
        console.error('Error updating sale status in Vercel Postgres:', error);
        throw error;
    } finally {
        client.release();
    }
}
