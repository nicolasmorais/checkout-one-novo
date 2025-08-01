
import { db, sql } from '@vercel/postgres';

export async function createProductsTable() {
  try {
    // Ensure the client is connected
    await db.connect();
    
    const result = await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Table "products" created successfully:', result);
  } catch (error) {
    console.error('Error creating products table:', error);
    throw error;
  }
}
