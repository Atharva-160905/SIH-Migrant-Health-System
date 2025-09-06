import { SQLDatabase } from 'encore.dev/storage/sqldb';

export const healthDB = new SQLDatabase("health", {
  migrations: "./migrations",
});
