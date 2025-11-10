import express from "express";

import { serverSetup } from "./initialization/serverSetup.js";

const app = express();

const start = async () => {
  try {
    await serverSetup(app);
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

start();
