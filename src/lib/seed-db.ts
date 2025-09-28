// src/lib/seed-db.ts

'use server';

import { db } from '@vercel/postgres';
import { createProductsTable } from "@/services/products-service"; // Importa a função de criação da tabela de produtos

export async function createTables() {
  console.log('Starting table creation...');
  const client = await db.connect();
  try {
    // DROPA as tabelas se elas existirem para garantir um recomeço limpo
    // CUIDADO: ISSO APAGARÁ TODOS OS DADOS EXISTENTES NAS TABELAS EM PRODUÇÃO
    await client.sql`DROP TABLE IF EXISTS sales CASCADE;`;
    await client.sql`DROP TABLE IF EXISTS products CASCADE;`;
    console.log('Existing "sales" and "products" tables dropped.');

    // Chama a função para criar a tabela de produtos
    await createProductsTable();
    console.log('Table "products" created by product service.');

    // Cria a tabela de vendas
    await client.sql`
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
    console.log('Table "sales" created.');

    console.log('Successfully finished table creation process.');

  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
      client.release();
  }
}
