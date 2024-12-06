import sql, { ConnectionPool } from "mssql";

const dbConfig: sql.config = {
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    encrypt: process.env.SQL_ENCRYPTED_CONN === 'true'
  }
};

let pool: ConnectionPool;

async function getConnection(): Promise<ConnectionPool> {
  try {
    if (pool) return pool;                // Check if there's already a connection pool 
    pool = await sql.connect(dbConfig);   // or create one if it doesn't exist
    return pool;
  } catch (err) {
    console.error("Error trying to connect to database", err)
  }
}

export { sql, getConnection };