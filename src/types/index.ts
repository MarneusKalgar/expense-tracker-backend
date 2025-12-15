import z from "zod";

import { loginInputSchema, signupInputSchema } from "@/schemas/index.js";

export type LoginInput = z.infer<typeof loginInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;
