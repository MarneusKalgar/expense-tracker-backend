import express from "express";

import { healthCheck, livenessCheck, readinessCheck } from "@/controllers/index.js";
import { asyncWrapper } from "@/middlewares/index.js";

export const healthRouter = express.Router();

healthRouter.get("/health", asyncWrapper(healthCheck));
healthRouter.get("/ready", asyncWrapper(readinessCheck));
healthRouter.get("/live", livenessCheck);
