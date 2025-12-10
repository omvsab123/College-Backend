import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.user,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  });

  const name = process.env.DB_USER;
  const email = process.env.EMAIL_USER;     // change if desired
  const password = process.env.EMAIL_PASS;       // change if desired
  const hashed = await bcrypt.hash(password, 10);

  await conn.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed]
  );

  console.log("Created user:", email, "password:", password);
  await conn.end();
  process.exit(0);
})();