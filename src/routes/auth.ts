import express, { Request, Response } from "express";

export const authRouter = express.Router();

authRouter.post("/signup", (req: Request, res: Response) => {
  // Placeholder for registration logic
  res.send("Register route");
});

authRouter.post("/login", (req: Request, res: Response) => {
  // Placeholder for login logic
  res.send("Login route");
});
