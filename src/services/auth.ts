import bcrypt from "bcrypt";

import { LoginInput, SignupInput } from "@/types/index.js";

import { userService } from "./user.js";

class AuthService {
  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return user.id;
  }

  async signup(data: SignupInput) {
    const { email, firstName, lastName, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await userService.createUser({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    return userId;
  }
}

export const authService = new AuthService();
