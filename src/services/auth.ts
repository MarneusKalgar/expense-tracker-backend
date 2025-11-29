import bcrypt from "bcrypt";

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

    return { accessToken, refreshToken, userId: user.id };
  }

  async signup(data: SignupInput) {
    const userId = await userService.createUser(data);
    return userId;
  }
}

export const authService = new AuthService();
