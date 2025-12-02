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

  async revokeRefreshToken(token: string) {
    try {
      await redisClient.del(`refreshToken:${token}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to revoke refresh token: ${errorMessage}`);
    }
  }

  async storeRefreshToken(token: string, userId: string) {
    try {
      await redisClient.set(`refreshToken:${token}`, userId, "EX", env.redis.ttl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to store refresh token: ${errorMessage}`);
    }
  }

  async validateRefreshToken(token: string, userId: string) {
    const storedUserId = await redisClient.get(`refreshToken:${token}`);
    return storedUserId === userId;
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new AuthError(`Invalid or expired access token: ${errorMessage}`);
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new AuthError(`Invalid or expired refresh token: ${errorMessage}`);
    }
  }
}

export const tokenService = new TokenService();
