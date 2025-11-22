import { DataSource, DataSourceOptions } from "typeorm";

import { User } from "./entity/index.js";

const options: DataSourceOptions = {
  entities: [User],
  logging: false,
  migrations: [],
  poolSize: 5,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true, // Note: set to false in production
  type: "postgres",
  url: process.env.DATABASE_URL,
};

export const dataSource = new DataSource(options);
