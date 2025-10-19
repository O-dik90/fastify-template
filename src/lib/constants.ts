import z from "zod";

export const notAuthorizedSchema = z.object({
  message: z.string(),
});