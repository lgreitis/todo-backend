import { z } from 'zod';

export const GetDirectoryChildrenSchema = z.object({ parentId: z.string() }).strict();

export type GetDirectoryChildrenDto = z.infer<typeof GetDirectoryChildrenSchema>;

const ItemEnumSchema = z.enum(['file', 'folder']);

export const ItemEnum = ItemEnumSchema.Enum;

export const CreateItemSchema = z
  .object({
    type: ItemEnumSchema,
    name: z.string(),
    parentId: z.string().optional(),
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
