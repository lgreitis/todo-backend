import { PORT } from '@constants';
import { Database } from '@hocuspocus/extension-database';
import { Server } from '@hocuspocus/server';
import { fileService } from '@services';
import { logger } from '@utils/logger';

const hocuspocusConfig = () => {
  const server = Server.configure({
    port: PORT,
    extensions: [
      new Database({
        store: async (data) => {
          try {
            console.log('saving', data.documentName);
            const serializedData = data.state.toString('base64');
            fileService.setFileData(data.documentName, serializedData);
          } catch (error) {
            logger.error(error);
          }
        },
        fetch: async (data) => {
          console.log('loading data', data.documentName);
          const file = await fileService.getFileById(data.documentName).catch((error) => {
            logger.error(error);
          });
          // eslint-disable-next-line unicorn/no-null
          return file && file.data ? Uint8Array.from(Buffer.from(file.data, 'base64')) : null;
        },
      }),
    ],
  });

  return server;
};

export default hocuspocusConfig;
