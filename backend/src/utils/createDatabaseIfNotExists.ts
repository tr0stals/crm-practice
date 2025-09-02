import { createConnection } from 'mysql2/promise';

type MysqlConnectionConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  charset?: string;
  collation?: string;
};

export async function createDatabaseIfNotExists(config: MysqlConnectionConfig): Promise<void> {
  const { host, port, user, password, database, charset = 'utf8mb4', collation = 'utf8mb4_unicode_ci' } = config;

  const connection = await createConnection({ host, port, user, password, multipleStatements: false });
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET ${charset} COLLATE ${collation}`,
    );
  } finally {
    await connection.end();
  }
}


