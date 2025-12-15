import z from "zod";

export const extractZodErrors = (error: z.ZodError, fallback: string): string => {
  return (
    error.issues?.map(el => `Field: ${el.path.join(".")}, Error: ${el.message}`).join(", ") ??
    fallback
  );
};
