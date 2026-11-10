import { z } from "zod";

export const loginSchema = z.object({
  username: z.string({ message: "Revisar usuario y contraseña" }),
  password: z
    .string()
    .min(6, { message: "Revisar usuario y contraseña" }),
});

export type loginForm = z.infer<typeof loginSchema>;
