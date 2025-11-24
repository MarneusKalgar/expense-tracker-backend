import bcrypt from "bcrypt";

import { dataSource } from "@/data-source.js";
import { User } from "@/entity/User.js";
import { SignupInput } from "@/types/index.js";
import { BadRequestError } from "@/utils/index.js";

class UserService {
  async createUser(userData: SignupInput) {
    const { email, firstName, lastName, password } = userData;
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS ?? "10") || 10,
    );

    const newUser = dataSource.getRepository(User).create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    await dataSource.getRepository(User).save(newUser);
    return newUser.id;
  }

  async getUserByEmail(email: string) {
    const user = await dataSource.getRepository(User).findOne({
      where: { email },
    });
    return user;
  }
}

export const userService = new UserService();
