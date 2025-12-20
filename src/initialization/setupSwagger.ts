import { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "@/configs/swagger.js";

export const setupSwagger = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
