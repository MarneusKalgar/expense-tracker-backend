import { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { env, logger } from "@/configs/index.js";
import { getCachedSpec, getSwaggerSpecs } from "@/configs/swagger.js";

export const setupSwagger = (app: Express) => {
  const urls = getSwaggerSpecs();

  if (!urls.length) {
    logger.warn("No API specifications found. Swagger UI will be unavailable.");
    return;
  }

  app.get("/api-specs/:filename", (req, res) => {
    try {
      const { filename } = req.params;
      const spec = getCachedSpec(filename);
      res.send(spec);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Spec file not found";
      res.status(404).json({ error: errorMessage });
    }
  });

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
      explorer: true,
      swaggerOptions: {
        urls,
      },
    }),
  );

  logger.info(`Swagger UI available at ${env.serverUrl}/docs`);
};
