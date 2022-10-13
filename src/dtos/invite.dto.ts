import { z } from 'zod';
import { CreateUserSchema } from './user.dto';

export const GetAllInvitesSchema = z.object({ organizationId: z.string() }).strict();

export type GetAllInvitesDto = z.infer<typeof GetAllInvitesSchema>;

export const GetInviteSchema = z.object({ id: z.string() }).strict();

export type GetInviteDto = z.infer<typeof GetInviteSchema>;

export const CreateInviteSchema = z
  .object({
    organizationId: z.string(),
    expirationDate: z.number(),
  })
  .strict();

export type CreateInviteDto = z.infer<typeof CreateInviteSchema>;

export const EditInviteSchema = z
  .object({
    id: z.string(),
    expirationDate: z.number().optional(),
    disabled: z.boolean().optional(),
  })
  .strict();

export type EditInviteDto = z.infer<typeof EditInviteSchema>;

const BaseCreateInvitedUserSchema = z.object({ inviteId: z.string() }).strict();

export const CreateInvitedUserSchema = BaseCreateInvitedUserSchema.merge(CreateUserSchema);

export type CreateInvitedUserDto = z.infer<typeof CreateInvitedUserSchema>;

export const AddUserFromInviteSchema = z
  .object({
    inviteId: z.string(),
  })
  .strict();

export type AddUserFromInviteDto = z.infer<typeof AddUserFromInviteSchema>;
