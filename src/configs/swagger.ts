import fs from "node:fs";
import yaml from "yaml";

import { env, logger } from "@/configs/index.js";
import { SwaggerSpec, swaggerSpecSchema } from "@/schemas/index.js";
import {
  extractZodErrors,
  getFileContent,
  getVersionFromFilename,
  NotFoundError,
  resolveFilePath,
  ValidationError,
} from "@/utils/index.js";

interface SwaggerUrl {
  name: string;
  url: string;
}

const docsDir = resolveFilePath("../docs/output");
const specsCache = new Map<string, SwaggerSpec>();

const processAndCacheSpec = (filename: string) => {
  if (specsCache.has(filename)) {
    return;
  }

  const content = getFileContent(docsDir, filename);
  const parsed: SwaggerSpec = yaml.parse(content);
  const result = swaggerSpecSchema.safeParse(parsed);

  if (!result.success) {
    const message = extractZodErrors(result.error, "Invalid Swagger specification");
    throw new ValidationError(message);
  }

  const { data } = result;

  if (data.servers && data.servers.length > 0) {
    data.servers = [
      {
        description: env.nodeEnv === "production" ? "Production Server" : "Development Server",
        url: env.serverUrl,
      },
    ];
  }

  specsCache.set(filename, data);
};

const getYamlFiles = (): string[] => {
  try {
    if (!fs.existsSync(docsDir)) {
      logger.warn(`Docs directory not found: ${docsDir}`);
      return [];
    }

    return fs
      .readdirSync(docsDir)
      .filter(file => file.endsWith(".yaml") && file.startsWith("openapi."));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Error reading docs directory: ${errorMessage}`);
    throw new NotFoundError(`Error reading docs directory: ${errorMessage}`);
  }
};

export const getSwaggerSpecs = (): SwaggerUrl[] => {
  try {
    const yamlFiles = getYamlFiles();

    for (const file of yamlFiles) {
      processAndCacheSpec(file);
    }

    return yamlFiles
      .map(file => {
        const version = getVersionFromFilename(file);
        return {
          name: `Expense Tracker API v${version}`,
          url: `/api-specs/${file}`,
          version: parseFloat(version),
        };
      })
      .sort((a, b) => b.version - a.version);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Error reading Swagger spec files: ${errorMessage}`);
    throw new NotFoundError(`Error reading Swagger spec files: ${errorMessage}`);
  }
};

export const getCachedSpec = (filename: string): SwaggerSpec => {
  const spec = specsCache.get(filename);
  if (!spec) {
    logger.error(`Spec file ${filename} not found in cache`);
    throw new NotFoundError(`Spec file ${filename} not found in cache`);
  }
  return spec;
};
