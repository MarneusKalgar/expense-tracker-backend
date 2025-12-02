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
    maxAge: 86400000, // 1 day
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    data: { accessToken, userId },
    message: "Login successful",
    success: true,
  });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const accessToken = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    data: { accessToken },
    message: "Access token refreshed successfully",
    success: true,
  });
};

export const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  await authService.logout(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "Logout successful",
    success: true,
  });
};
