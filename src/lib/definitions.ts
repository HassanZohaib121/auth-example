import { z } from "zod";

// Signup form validation schema
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

// Form state type for handling validation errors
export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

// Session payload schema
export const sessionPayloadSchema = z.object({
  userId: z.string().min(1),
  expiresAt: z.date(),
});

// Inferred types from schemas
export type SignupForm = z.infer<typeof SignupFormSchema>;
export type SessionPayload = z.infer<typeof sessionPayloadSchema>;

// Helper type for form validation errors
export type FormErrors = NonNullable<FormState>["errors"];
