const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://avnadmin:AVNS_82_tgdyIXTtSRL6D37M@pg-20658f45-shuklaitconsulting-a974.e.aivencloud.com:12079/defaultdb",
  ssl: {
    // This is the critical part for Aiven/Cloud DBs
    rejectUnauthorized: false 
  }
});

// Add this to catch errors during the initial handshake
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;