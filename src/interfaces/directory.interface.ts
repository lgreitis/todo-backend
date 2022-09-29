export interface DirectoryItems {
  id: string;
  name: string;
  parentId?: string;
  type: 'folder' | 'file';
}
