import z from "zod";

export const paramsSchema = z.object({
  id: z.uuid(),
});

export type ParamsInput = z.infer<typeof paramsSchema>;
