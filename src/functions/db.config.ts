import pg, { PoolConfig } from 'pg';

const config: PoolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'position',
  password: process.env.DB_PASSWORD || 'positionApi@2024',
  port: parseInt(process.env.DB_PORT || '9801'),
};

export const pool = new pg.Pool(config);
