import { db } from "../config/db.js";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: string;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const query =
      "SELECT id, email, password_hash, role FROM users WHERE email = $1";
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
  } catch (error) {
    console.error("Database error in findUserByEmail:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    console.log("Querying database...");
    const { rows } = await db.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createUser = async (email: string, passwordHash: string, role: string) => {
  const query = "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role";
  const { rows } = await db.query(query, [email, passwordHash, role]);
  return rows[0];
};

export const deleteUserById = async (id: number) => {
  const query = "DELETE FROM users WHERE id = $1 RETURNING id";
  const { rows } = await db.query(query, [id]);
  return rows[0]; 
};
