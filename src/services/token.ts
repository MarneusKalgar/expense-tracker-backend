import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "@/configs/index.js";
import { AuthError } from "@/utils/index.js";

interface JwtPayload {
  email: string;
  exp: number;
  iat: number;
  userId: string;
}

class TokenService {
  generateAccessToken(payload: object) {
    const accessToken = jwt.sign(payload, env.jwt.accessSecret, {
      expiresIn: env.jwt.accessExpiresIn,
    } as SignOptions);

    return accessToken;
  }

  generateRefreshToken(payload: object) {
    const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiresIn,
    } as SignOptions);

    return refreshToken;
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
    } catch (error) {
      // eslint-disable-line
      throw new AuthError("Invalid or expired access token");
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
    } catch (error) {
      // eslint-disable-line
      throw new AuthError("Invalid or expired refresh token");
    }
  }
}

export const tokenService = new TokenService();
