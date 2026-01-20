import { db } from '../src/config/db'; // Double check this path!

export const getAllUsers = async () => {
  try {
    console.log("Querying database...");
    const { rows } = await db.query('SELECT * FROM users');
    return rows;
  } catch (error) {
    console.error("Error:", error);
    throw error; 
  }
};