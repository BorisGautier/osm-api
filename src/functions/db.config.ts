import pg, { PoolConfig } from 'pg';

const config: PoolConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'position',
  password: 'postgres',
  port: 5432
};

export const pool = new pg.Pool(config);
