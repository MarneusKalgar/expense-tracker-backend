import swaggerJsdoc from "swagger-jsdoc";

import { env } from "@/configs/index.js";
import { resolveFilePath } from "@/utils/index.js";

const docsPath = resolveFilePath("../docs/output/**/*.yaml");

const options: swaggerJsdoc.Options = {
  apis: [docsPath],
  definition: {
    info: {
      description: "API documentation for Expense Tracker application",
      title: "Expense Tracker API",
      version: "1.0.0",
    },
    openapi: "3.1.0",
    servers: [
      {
        description: "Development server",
        url: env.serverUrl,
      },
    ],
  },
};

export const swaggerSpec = swaggerJsdoc(options);
