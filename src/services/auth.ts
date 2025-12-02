import bcrypt from "bcrypt";

import { redisClient } from "@/configs/index.js";
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

    const hashedPassword = user?.password ?? (await bcrypt.hash("dummy-password", 10));
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new ForbiddenError("Invalid email or password");
    }

    const payload = { email: user.email, userId: user.id };

    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    await tokenService.storeRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken, userId: user.id };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }

    const userId = await redisClient.get(`refreshToken:${refreshToken}`);

    if (userId) {
      await tokenService.revokeRefreshToken(refreshToken, userId);
    }
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

    const isValid = await tokenService.validateRefreshToken(refreshToken, userId);
    if (!isValid) {
      throw new ForbiddenError("Token has been revoked");
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      await tokenService.revokeRefreshToken(refreshToken, userId);
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
