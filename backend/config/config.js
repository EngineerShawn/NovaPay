const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  // Environment variables
    port: process.env.PORT || 5000,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }
};
