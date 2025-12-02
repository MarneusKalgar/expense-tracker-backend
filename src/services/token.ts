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
  /**
   * Generates a new JWT access token
   * @param payload - Token payload containing user email and ID
   * @returns A signed JWT access token string
   */
  generateAccessToken(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, env.jwt.accessSecret, {
      expiresIn: env.jwt.accessExpiresIn,
    } as SignOptions);

    return accessToken;
  }

  /**
   * Generates a new JWT refresh token
   * @param payload - Token payload containing user email and ID
   * @returns A signed JWT refresh token string
   */
  generateRefreshToken(payload: TokenPayload) {
    const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiresIn,
    } as SignOptions);

    return refreshToken;
  }

  /**
   * Revokes a refresh token by removing it from Redis storage
   * @param token - The refresh token to revoke
   * @throws {Error} If Redis operation fails
   */
  async revokeRefreshToken(token: string) {
    try {
      await redisClient.del(`refreshToken:${token}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to revoke refresh token: ${errorMessage}`);
    }
  }

  /**
   * Stores a refresh token in Redis with expiration
   * @param token - The refresh token to store
   * @param userId - The ID of the user this token belongs to
   * @throws {Error} If Redis operation fails
   */
  async storeRefreshToken(token: string, userId: string) {
    try {
      await redisClient.set(`refreshToken:${token}`, userId, "EX", env.redis.ttl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to store refresh token: ${errorMessage}`);
    }
  }

  /**
   * Validates that a refresh token exists and belongs to the specified user
   * @param token - The refresh token to validate
   * @param userId - The expected user ID
   * @returns True if token is valid and belongs to the user, false otherwise
   * @throws {Error} If Redis operation fails
   */
  async validateRefreshToken(token: string, userId: string) {
    try {
      const storedUserId = await redisClient.get(`refreshToken:${token}`);
      return storedUserId === userId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to validate refresh token: ${errorMessage}`);
    }
  }

  /**
   * Verifies and decodes a JWT access token
   * @param token - The access token to verify
   * @returns Decoded JWT payload containing user information
   * @throws {AuthError} If token is invalid or expired
   */
  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new AuthError(`Invalid or expired access token: ${errorMessage}`);
    }
  }

  /**
   * Verifies and decodes a JWT refresh token
   * @param token - The refresh token to verify
   * @returns Decoded JWT payload containing user information
   * @throws {AuthError} If token is invalid or expired
   */
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
