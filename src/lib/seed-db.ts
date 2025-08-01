
import { db, sql } from '@vercel/postgres';

export async function createTables() {
  try {
    await db.connect();
    
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

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

    console.log('Tables "products" and "sales" created or already exist.');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}
