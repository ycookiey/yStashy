const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '.env.local' });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

const client = createClient({
  url,
  authToken,
});

async function main() {
  const sqlPath = path.join(__dirname, '..', 'drizzle', '0000_slimy_blindfold.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Executing SQL from:', sqlPath);
  console.log('--- SQL Content ---');
  console.log(sql);
  console.log('-------------------');

  try {
    // Split by semicolon to handle multiple statements if any (though usually one create table)
    const statements = sql.split(';').filter((s) => s.trim().length > 0);

    for (const statement of statements) {
      await client.execute(statement);
      console.log('Executed statement successfully.');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    client.close();
  }
}

main();
