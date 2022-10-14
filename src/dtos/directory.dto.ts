import { z } from 'zod';

export const GetDirectoryRootSchema = z.object({ organizationId: z.string() }).strict();

export type GetDirectoryRootDto = z.infer<typeof GetDirectoryRootSchema>;

export const GetDirectoryChildrenSchema = z
  .object({ parentId: z.string(), organizationId: z.string() })
  .strict();

export type GetDirectoryChildrenDto = z.infer<typeof GetDirectoryChildrenSchema>;

const ItemEnumSchema = z.enum(['file', 'folder']);

export const ItemEnum = ItemEnumSchema.Enum;

export const CreateItemSchema = z
  .object({
    type: ItemEnumSchema,
    name: z.string(),
    parentId: z.string().optional(),
    organizationId: z.string(),
  })
  .strict();

export type CreateItemDto = z.infer<typeof CreateItemSchema>;

export const EditItemSchema = z
  .object({
    type: ItemEnumSchema,
    name: z.string(),
    id: z.string(),
  })
  .strict();

export type EditItemDto = z.infer<typeof EditItemSchema>;

export const RemoveItemSchema = z
  .object({
    type: ItemEnumSchema,
    id: z.string(),
  })
  .strict();

export type RemoveItemDto = z.infer<typeof RemoveItemSchema>;

export const GetFileSchema = z.object({
  folderId: z.string(),
  organizationId: z.string(),
  fileId: z.string(),
});

export type GetFileDto = z.infer<typeof GetFileSchema>;
