import { dataSource } from "./data-source.js";

export const setupDb = async () => {
  try {
    await dataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization:", err);
    throw err;
  }
};
