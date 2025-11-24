import bcrypt from "bcrypt";

import { LoginInput, SignupInput } from "@/types/index.js";
import { ForbiddenError } from "@/utils/index.js";

import { userService } from "./user.js";

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

    return user.id;
  }

  async signup(data: SignupInput) {
    const userId = await userService.createUser(data);
    return userId;
  }
}

export const authService = new AuthService();
