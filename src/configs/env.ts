import { z } from "zod";

import { type Environment, envSchema } from "@/schemas/index.js";
import { extractZodErrors } from "@/utils/index.js";

type EnvType = ReturnType<typeof getEnv>;

let parsedEnv: Environment;

let _env: EnvType | null = null;

try {
  const result = envSchema.parse(process.env);
  parsedEnv = result;
} catch (error) {
  if (error instanceof z.ZodError) {
    const message = extractZodErrors(error, "Invalid environment variables");
    console.error(message);
  }
  process.exit(1);
}

export const getEnv = () => {
  return {
    bcrypt: {
      saltRounds: parsedEnv.BCRYPT_SALT_ROUNDS,
    },
    databaseUrl: parsedEnv.DATABASE_URL,
    jwt: {
      accessExpiresIn: parsedEnv.JWT_ACCESS_EXPIRES_IN,
      accessSecret: parsedEnv.JWT_ACCESS_SECRET,
      refreshExpiresIn: parsedEnv.JWT_REFRESH_EXPIRES_IN,
      refreshSecret: parsedEnv.JWT_REFRESH_SECRET,
    },
    logLevel: parsedEnv.APP_LOG_LEVEL,
    nodeEnv: parsedEnv.NODE_ENV,
    port: parsedEnv.PORT,
    redis: {
      host: parsedEnv.REDIS_CLOUD_HOST,
      password: parsedEnv.REDIS_CLOUD_PASSWORD,
      port: parsedEnv.REDIS_CLOUD_PORT,
      ttl: parsedEnv.REDIS_APP_KEY_TTL,
      user: parsedEnv.REDIS_CLOUD_USER,
    },
  } as const;
};

export const env = new Proxy({} as EnvType, {
  get: (_, prop: string) => {
    _env ??= getEnv();
    return _env[prop as keyof typeof _env];
  },
});
