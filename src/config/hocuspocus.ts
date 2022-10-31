import { PORT } from '@constants';
import { Database } from '@hocuspocus/extension-database';
import { Server } from '@hocuspocus/server';

const hocuspocusConfig = () => {
  const server = Server.configure({
    port: PORT,
    extensions: [
      new Database({
        // fetch: async (data) => {},
        store: async (data) => {
          console.log(data.state);
        },
      }),
    ],

    // onLoadDocument: async (data) => {

    // },
    // onStoreDocument: async (data) => {
    //   //   console.log(data.document.);
    // },
  });

  return server;
};

export default hocuspocusConfig;
