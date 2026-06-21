import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name is required"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Minimum 8 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Minimum 8 characters"),
});