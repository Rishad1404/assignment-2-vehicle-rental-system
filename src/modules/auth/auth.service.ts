import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signinUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return false;
  }

  const token = jwt.sign(
    { name: user.name, role: user.role, email: user.email },
    config.jwtSecret as string,
    { expiresIn: "30d" }
  );

  console.log({ token });

  return { token, user };
};

const signupUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: "admin" | "customer" = "customer"
) => {
  const existing = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email.toLowerCase(),
  ]);
  if (existing.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) 
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );

  const user = result.rows[0];

  const token = jwt.sign(
    { name: user.name, role: user.role, email: user.email },
    config.jwtSecret as string,
    { expiresIn: "30d" }
  );

  return { token, user };
};

export const authServices = {
  signinUser,
  signupUser,
};
