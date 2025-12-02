import jwt, { SignOptions } from "jsonwebtoken";

import { env, redisClient } from "@/configs/index.js";
import { AuthError } from "@/utils/index.js";

interface JwtPayload {
  email: string;
  exp: number;
  iat: number;
  userId: string;
}

interface TokenPayload {
  email: string;
  userId: string;
}

class TokenService {
  generateAccessToken(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, env.jwt.accessSecret, {
      expiresIn: env.jwt.accessExpiresIn,
    } as SignOptions);

    return accessToken;
  }

  generateRefreshToken(payload: TokenPayload) {
    const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiresIn,
    } as SignOptions);

    return refreshToken;
  }

  async revokeRefreshToken(token: string, userId: string) {
    const pipeline = redisClient.multi();
    pipeline.srem(`user:${userId}:refreshTokens`, token);
    pipeline.del(`refreshToken:${token}`);
    await pipeline.exec();
  }

  async storeRefreshToken(token: string, userId: string) {
    const multi = redisClient.multi();
    const setKey = `user:${userId}:refreshTokens`;

    const existingTokens = await redisClient.smembers(setKey);

    for (const oldToken of existingTokens) {
      const exists = await redisClient.exists(`refreshToken:${oldToken}`);
      if (!exists) {
        multi.srem(setKey, oldToken);
      }
    }

    multi.set(`refreshToken:${token}`, userId, "EX", env.redis.ttl);
    multi.sadd(`user:${userId}:refreshTokens`, token);
    multi.expire(`user:${userId}:refreshTokens`, env.redis.ttl);
    await multi.exec();
  }

  async validateRefreshToken(token: string, userId: string) {
    const result = await redisClient.sismember(`user:${userId}:refreshTokens`, token);
    return result === 1;
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
      // eslint-disable-next-line
    } catch (error) {
      throw new AuthError("Invalid or expired access token");
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
      // eslint-disable-next-line
    } catch (error) {
      throw new AuthError("Invalid or expired refresh token");
    }
  }
}

export const tokenService = new TokenService();
