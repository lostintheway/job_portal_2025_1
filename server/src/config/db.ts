import mysql from "mysql2";
import { createTables } from "./migrations";

console.log("DB_HOST", process.env.DB_HOST);
console.log("DB_USER", process.env.DB_USER);

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Function to check and create tables
export function checkAndCreateTable(tableName: string, tableSchema: string) {
  return new Promise((resolve, reject) => {
    const checkTableQuery = `SHOW TABLES LIKE '${tableName}';`;

    pool.query(checkTableQuery, (err, results: mysql.QueryResult) => {
      if (err) return reject(err);

      if (Array.isArray(results) && results.length === 0) {
        const createTableQuery = `CREATE TABLE ${tableName} (${tableSchema});`;

        pool.query(createTableQuery, (err) => {
          if (err) return reject(err);
          console.log(`Table "${tableName}" created successfully.`);
          resolve(true);
        });
      } else {
        console.log(`Table "${tableName}" already exists.`);
        resolve(false);
      }
    });
  });
}

// Close the database pool once all tables are created
export function closeConnection() {
  pool.end();
}

// Function to create necessary tables on app start
export function createTablesOnStartup() {
  try {
    createTables();
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    process.exit(1);
  }
}

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool.promise();
