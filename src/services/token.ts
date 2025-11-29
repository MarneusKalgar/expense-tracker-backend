import jwt, { SignOptions } from "jsonwebtoken";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;

class TokenService {
  generateAccessToken(payload: object) {
    if (!accessSecret || !accessExpiresIn) {
      throw new Error(
        "JWT access secret or expiration time are not defined in environment variables",
      );
    }

    const accessToken = jwt.sign(payload, accessSecret, {
      expiresIn: accessExpiresIn,
    } as SignOptions);

    return accessToken;
  }

  generateRefreshToken(payload: object) {
    if (!refreshSecret || !refreshExpiresIn) {
      throw new Error(
        "JWT refresh secret or expiration time are not defined in environment variables",
      );
    }

    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: refreshExpiresIn,
    } as SignOptions);

    return refreshToken;
  }
}

export const tokenService = new TokenService();
