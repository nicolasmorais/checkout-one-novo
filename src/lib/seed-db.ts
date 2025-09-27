// src/lib/seed-db.ts

'use server';

import { sql } from '@vercel/postgres';
import { createProductsTable } from "@/services/products-service"; // Importa a função de criação da tabela de produtos

export async function createTables() {
  console.log('Starting table creation...');
  try {
    // Chama a função para criar a tabela de produtos do serviço de produtos
    await createProductsTable();
    console.log('Table "products" checked/created by product service.');

    await sql`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        transaction_id VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        amount_in_cents INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        pix_code TEXT,
        sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Table "sales" checked/created.');

    console.log('Successfully finished table creation process.');

  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}
