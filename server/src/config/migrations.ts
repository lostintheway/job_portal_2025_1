import { pool } from "./db";

export async function createTables() {
  try {
    console.log("at createTables test");
    // Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Companies Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255) NOT NULL,
        website VARCHAR(255),
        logo_url VARCHAR(255),
        user_id INTEGER REFERENCES users(id),
        industry VARCHAR(255) NOT NULL,
        size VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        salary_range VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        company_id INTEGER REFERENCES companies(id),
        job_type VARCHAR(50) NOT NULL,
        experience_level VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Applications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id),
        user_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending',
        resume_url VARCHAR(255) NOT NULL,
        cover_letter TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add triggers for updated_at
    //await pool.query(`
    //   CREATE OR REPLACE FUNCTION update_updated_at_column()
    //   RETURNS TRIGGER AS $$
    //   BEGIN
    //     NEW.updated_at = CURRENT_TIMESTAMP;
    //     RETURN NEW;
    //   END;
    //   $$ language 'plpgsql';
    // `);

    // const tables = ["users", "companies", "jobs", "applications"];
    // for (const table of tables) {
    //  await pool.query(`
    //     DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
    //     CREATE TRIGGER update_${table}_updated_at
    //     BEFORE UPDATE ON ${table}
    //     FOR EACH ROW
    //     EXECUTE FUNCTION update_updated_at_column();
    //   `);
    // }

    console.log("All tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}
