import { z } from "zod";

export const swaggerSpecSchema = z.object({
  components: z
    .object({
      schemas: z.record(z.string(), z.any()).optional(),
    })
    .optional(),
  info: z.object({
    description: z.string().optional(),
    title: z.string(),
    version: z.string(),
  }),
  openapi: z.string(),
  paths: z.record(z.string(), z.any()),
  servers: z
    .array(
      z.object({
        description: z.string().optional(),
        url: z.string(),
      }),
    )
    .optional(),
  tags: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .optional(),
});

export type SwaggerSpec = z.infer<typeof swaggerSpecSchema>;
