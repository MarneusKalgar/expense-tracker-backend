import { DataSource, DataSourceOptions } from "typeorm";

import { env } from "@/configs/index.js";

import { Account, Category, Currency, Transaction, User } from "./entity/index.js";

const options: DataSourceOptions = {
  entities: [User, Account, Category, Currency, Transaction],
  logger: env.nodeEnv === "development" ? "advanced-console" : "simple-console",
  logging: env.nodeEnv === "development" ? ["query", "error", "schema", "warn"] : ["error", "warn"],
  migrations: [],
  poolSize: 5,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: env.nodeEnv === "development",
  type: "postgres",
  url: env.databaseUrl,
};

export const dataSource = new DataSource(options);
