import z from "zod";

import { LoginInputSchema, SignupInputSchema } from "@/schemas/index.js";

export type LoginInput = z.infer<typeof LoginInputSchema>;
export type SignupInput = z.infer<typeof SignupInputSchema>;
