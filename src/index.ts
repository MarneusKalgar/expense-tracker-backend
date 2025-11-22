import "reflect-metadata";
import express from "express";

import { serverSetup } from "./initialization/serverSetup.js";
import { setupDb } from "./initialization/setupDb.js";

const app = express();

const start = async () => {
  try {
    await setupDb();
    await serverSetup(app);
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

start();
