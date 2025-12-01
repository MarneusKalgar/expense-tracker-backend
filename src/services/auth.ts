import bcrypt from "bcrypt";

import { redisClient } from "@/configs/index.js";
import { env } from "@/configs/index.js";
import { tokenService, userService } from "@/services/index.js";
import { LoginInput, SignupInput } from "@/types/index.js";
import { ForbiddenError } from "@/utils/index.js";

class AuthService {
  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new ForbiddenError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenError("Invalid email or password");
    }

    const payload = { email: user.email, userId: user.id };

    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    await redisClient.set(`refreshToken:${refreshToken}`, user.id, "EX", env.redis.ttl);
    await redisClient.sadd(`user:${user.id}:refreshTokens`, refreshToken);
    await redisClient.expire(`user:${user.id}:refreshTokens`, env.redis.ttl);

    return { accessToken, refreshToken, userId: user.id };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new ForbiddenError("No refresh token provided");
    }

    const userId = await redisClient.get(`refreshToken:${refreshToken}`);

    if (!userId) {
      throw new ForbiddenError("Invalid refresh token");
    }

    await redisClient.srem(`user:${userId}:refreshTokens`, refreshToken);
    await redisClient.del(`refreshToken:${refreshToken}`);
  }

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ForbiddenError("No refresh token provided");
    }

    tokenService.verifyRefreshToken(refreshToken);

    const userId = await redisClient.get(`refreshToken:${refreshToken}`);
    if (!userId) {
      throw new ForbiddenError("Invalid refresh token");
    }

    const isValid = await redisClient.sismember(`user:${userId}:refreshTokens`, refreshToken);
    if (!isValid) {
      throw new ForbiddenError("Token has been revoked");
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      await redisClient.del(`refreshToken:${refreshToken}`);
      await redisClient.srem(`user:${userId}:refreshTokens`, refreshToken);
      throw new ForbiddenError("User not found");
    }

    const payload = { email: user.email, userId: user.id };
    const newAccessToken = tokenService.generateAccessToken(payload);

    return newAccessToken;
  }

  async signup(data: SignupInput) {
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      throw new ForbiddenError("Email is already in use");
    }
    const userId = await userService.createUser(data);
    return userId;
  }
}

export const authService = new AuthService();
