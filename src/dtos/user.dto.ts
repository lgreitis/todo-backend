import { z } from 'zod';

export const CreateUserSchema = z
  .object({ username: z.string(), email: z.string().email(), password: z.string() })
  .strict();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const LoginUserSchema = z
  .object({ email: z.string().email(), password: z.string() })
  .strict();

export type LoginUserDto = z.infer<typeof LoginUserSchema>;
