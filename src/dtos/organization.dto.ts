import { z } from 'zod';

export const CreateOrganizationSchema = z.object({ name: z.string().min(2) }).strict();

export type CreateOrganizationDto = z.infer<typeof CreateOrganizationSchema>;

export const GetOrganizationSchema = z.object({ id: z.string() }).strict();

export type GetOrganizationDto = z.infer<typeof GetOrganizationSchema>;

export const EditOrganizationSchema = z
  .object({ id: z.string(), name: z.string().min(2).optional() })
  .strict();

export type EditOrganizationDto = z.infer<typeof EditOrganizationSchema>;

export const EditUserOnOrganizationSchema = z
  .object({ userId: z.string(), id: z.string() })
  .strict();

export type EditUserOnOrganizationDto = z.infer<typeof EditUserOnOrganizationSchema>;

export const DeleteOrganizationSchema = z.object({ id: z.string() }).strict();

export type DeleteOrganizationDto = z.infer<typeof DeleteOrganizationSchema>;
