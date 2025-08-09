import { z, type ZodTypeAny } from "zod";

export const validators = {
  email: z
    .string()
    .email("Invalid email format"),

  passwordhash: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(72, "Password must be at most 72 characters long")
    .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/(?=.*[0-9])/, "Password must contain at least one number")
    .regex(/(?=.*[^a-zA-Z0-9\s])/, "Password must contain at least one special character"),

    username:z.string()
    .min(3,"Username must be atleast 3 characters")
    .max(255,"Username must be atmost 255 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username  can only contain letters numbers and underscores ")
    .transform((value)=> value.toLowerCase())
};

export function validate<T extends object, U extends { [k in keyof T]: ZodTypeAny }>(
  object: T,
  validators: U
) {
  const schema = z.object(validators);
  const safeResult = schema.safeParse(object);

  if (!safeResult.success) {
    return [false, safeResult.error] as const;
  }

  return [true, safeResult.data] as const;
}
