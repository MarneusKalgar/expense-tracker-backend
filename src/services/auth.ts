import bcrypt from "bcrypt";

import { redisService, tokenService, userService } from "@/services/index.js";
import { LoginInput, SignupInput } from "@/types/index.js";
import { AuthError, getDefaultHash } from "@/utils/index.js";

const defaultHash = getDefaultHash();

class AuthService {
  /**
   * Authenticates a user with email and password
   * @param data - Login credentials containing email and password
   * @returns Object containing access token, refresh token, and user ID
   * @throws {AuthError} If credentials are invalid
   */
  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await userService.getUserByEmailWithPassword(email);
    const hashedPassword = user?.password ?? defaultHash;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!user || !isPasswordValid) {
      throw new AuthError("Invalid credentials");
    }

    const payload = { email: user.email, userId: user.id };

    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    await tokenService.storeRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken, userId: user.id };
  }

  /**
   * Logs out a user by revoking their refresh token
   * @param refreshToken - The refresh token to revoke
   * @returns Promise that resolves when logout is complete
   */
  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }

    const userId = await redisService.client.get(`refreshToken:${refreshToken}`);

    if (userId) {
      await tokenService.revokeRefreshToken(refreshToken);
    }
  }

  /**
   * Generates a new access token using a valid refresh token
   * @param refreshToken - The refresh token to validate and use
   * @returns A new access token
   * @throws {AuthError} If refresh token is invalid, revoked, or user not found
   */
  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new AuthError("No refresh token provided");
    }

    const userId = await redisService.client.get(`refreshToken:${refreshToken}`);
    if (!userId) {
      throw new AuthError("Invalid refresh token");
    }

    tokenService.verifyRefreshToken(refreshToken);

    const user = await userService.getUserByIdWithPassword(userId);
    if (!user) {
      await tokenService.revokeRefreshToken(refreshToken);
      throw new AuthError("User not found");
    }

    const payload = { email: user.email, userId: user.id };
    const newAccessToken = tokenService.generateAccessToken(payload);

    return newAccessToken;
  }

  /**
   * Registers a new user account
   * @param data - User registration data including email, password, first name, and last name
   * @returns The ID of the newly created user
   * @throws May throw validation or database errors
   */
  async signup(data: SignupInput) {
    const userId = await userService.createUser(data);
    return userId;
  }
}

export const authService = new AuthService();
