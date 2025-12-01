export const env = {
  jwt: {
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
  },
  redis: {
    host: process.env.REDIS_CLOUD_HOST,
    password: process.env.REDIS_CLOUD_PASSWORD,
    port: parseInt(process.env.REDIS_CLOUD_PORT!),
    ttl: parseInt(process.env.REDIS_APP_KEY_TTL!, 10),
    user: process.env.REDIS_CLOUD_USER,
  },
};
