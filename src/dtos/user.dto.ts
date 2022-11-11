import { z } from 'zod';

export const CreateUserSchema = z
  .object({
    username: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(5),
  })
  .strict();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const LoginUserSchema = z
  .object({ email: z.string().email(), password: z.string() })
  .strict();

export type LoginUserDto = z.infer<typeof LoginUserSchema>;

export const RegenerateTokensSchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type RegenerateTokensDto = z.infer<typeof RegenerateTokensSchema>;
