import * as z from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN"], {
    message: "Please select a role",
  }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
