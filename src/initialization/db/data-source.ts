import { DataSource, DataSourceOptions } from "typeorm";

import { env } from "@/configs/index.js";
import { User } from "@/entity/index.js";

const options: DataSourceOptions = {
  entities: [User],
  logging: false,
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
