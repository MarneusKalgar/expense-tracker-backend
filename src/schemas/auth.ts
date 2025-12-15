import z from "zod";

export const signupInputSchema = z.object({
  email: z.email(),
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  password: z.string().min(6),
});

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
