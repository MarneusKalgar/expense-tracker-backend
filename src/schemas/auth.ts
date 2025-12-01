import z from "zod";

export const SignupInputSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  password: z.string().min(6),
});

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
