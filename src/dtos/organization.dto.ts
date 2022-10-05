import { z } from 'zod';

export const CreateOrganizationSchema = z.object({ name: z.string() }).strict();

export type CreateOrganizationDto = z.infer<typeof CreateOrganizationSchema>;

export const GetOrganizationSchema = z.object({ id: z.string() }).strict();

export type GetOrganizationDto = z.infer<typeof GetOrganizationSchema>;

export const EditOrganizationSchema = z.object({ name: z.string() });

export type EditOrganizationDto = z.infer<typeof EditOrganizationSchema>;

export const AddUserToOrganizationSchema = z
  .object({ userId: z.string(), id: z.string() })
  .strict();

export type AddUserToOrganizationDto = z.infer<typeof AddUserToOrganizationSchema>;
