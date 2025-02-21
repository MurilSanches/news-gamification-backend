import sql from "../database/connection";

export const getUserByEmail = async (email: string) => {
  return await sql`SELECT * FROM users WHERE email = ${email}`;
};

export const getUserById = async (id: string) => {
  return await sql`SELECT * FROM users WHERE id = ${id}`;
};

export const createUser = async (email: string) => {
  return await sql`INSERT INTO users (email) VALUES (${email}) RETURNING *`;
};

export const updateUser = async (id: string, name: string) => {
  return await sql`UPDATE users SET name = ${name} WHERE id = ${id}`;
};
