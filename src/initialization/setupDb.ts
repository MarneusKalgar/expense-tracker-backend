import { logger } from "@/configs/index.js";

import { dataSource } from "../db/data-source.js";

export const setupDb = async () => {
  try {
    await dataSource.initialize();
    logger.info("Data Source has been initialized!");
  } catch (err) {
    logger.error("Error during Data Source initialization:", err);
    throw err;
  }
};
