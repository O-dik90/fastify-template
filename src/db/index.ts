import { env } from "@/env.js"; // assuming you have path alias set in tsconfig
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// create a connection pool
const poolConnection = mysql.createPool({
  host: env.HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  port: Number(env.DATABASE_PORT),
  database: env.DATABASE_NAME,
});

const db = drizzle(poolConnection, { 
  logger: true,
  casing: "snake_case",
});

export default db;
