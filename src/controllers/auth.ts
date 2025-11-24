import { Request, Response } from "express";

import { authService } from "@/services/auth.js";
// import { BadRequestError } from "@/utils/errors.js";

export const signupUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;

  const newUserId = await authService.signup({
    email,
    firstName,
    lastName,
    password,
  });

  res.status(201).json({
    data: { userId: newUserId },
    message: "User created successfully",
    success: true,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // // TODO move to validation middleware
  // if (!email || !password) {
  //   throw new BadRequestError("Email and password are required");
  // }

  const userId = await authService.login({ email, password });

  res.status(200).json({
    data: { userId },
    message: "Login successful",
    success: true,
  });
};
