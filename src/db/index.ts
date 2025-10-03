import { env } from "@/config/env.js";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// ts-ignoret-disable-next-line import/no-unresolved
import * as schema from "./schema/index.js";

// create a connection pool
const poolConnection = mysql.createPool({
  host: env.HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  port: Number(env.DATABASE_PORT),
  database: env.DATABASE_NAME,
  dateStrings: false,
});

const db = drizzle(poolConnection, { 
  schema,
  logger: true,
  mode: "default"
});

export default db;
