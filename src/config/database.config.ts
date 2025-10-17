import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'rimac',
  password: process.env.DB_PASSWORD || 'rimac',
  database: process.env.DB_NAME || 'rimac_talleres',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
}));
