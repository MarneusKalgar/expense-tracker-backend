import bcrypt from "bcrypt";

import { env } from "@/configs/index.js";
import { dataSource } from "@/db/data-source.js";
import { User } from "@/db/entity/index.js";
import { SignupInput } from "@/schemas/index.js";
import { BadRequestError } from "@/utils/index.js";

class UserService {
  async createUser(userData: SignupInput) {
    const { email, firstName, lastName, password } = userData;
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, env.bcrypt.saltRounds);

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

  async getUserByEmailWithPassword(email: string) {
    const user = await dataSource.getRepository(User).findOne({
      select: ["id", "email", "firstName", "lastName", "password"],
      where: { email },
    });
    return user;
  }

  async getUserById(userId: string) {
    const user = await dataSource.getRepository(User).findOne({
      where: { id: userId },
    });
    return user;
  }

  async getUserByIdWithPassword(userId: string) {
    const user = await dataSource.getRepository(User).findOne({
      select: ["id", "email", "firstName", "lastName", "password"],
      where: { id: userId },
    });
    return user;
  }
}

export const userService = new UserService();
