// src/lib/seed-db.ts

'use server';

import { db } from '@vercel/postgres';
import { createProductsTable } from "@/services/products-service"; // Importa a função de criação da tabela de produtos

export async function createTables() {
  console.log('Starting table creation...');
  const client = await db.connect();
  try {
    // DROPA a tabela de produtos se ela existir para garantir que o schema seja sempre o mais recente
    // CUIDADO: ISSO APAGARÁ TODOS OS DADOS EXISTENTES NA TABELA products EM PRODUÇÃO
    await client.sql`DROP TABLE IF EXISTS products CASCADE;`; // Adicionei CASCADE para remover dependências, se houver
    console.log('Existing "products" table dropped.');

    // Chama a função para criar a tabela de produtos do serviço de produtos
    await createProductsTable();
    console.log('Table "products" checked/created by product service.');

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
    console.log('Table "sales" checked/created.');

    console.log('Successfully finished table creation process.');

  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
      client.release();
  }
}
