import { Request, Response } from "express";

import { authService } from "@/services/auth.js";

export const signupUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;

  const newUserId = await authService.signup({
    email,
    firstName,
    lastName,
    password,
  });

  // TODO: Implement email verification in the future
  res.status(201).json({
    data: { userId: newUserId },
    message: "User created successfully. Please log in.",
    success: true,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, userId } = await authService.login({ email, password });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    data: { accessToken, userId },
    message: "Login successful",
    success: true,
  });
};
