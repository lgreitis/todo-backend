import { CREDENTIALS, LOG_FORMAT, ORIGIN } from '@constants';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { stream } from '@utils/logger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const expressConfig = (routes: Routes[]) => {
  const app = express();

  app.use(morgan(LOG_FORMAT, { stream }));
  app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
  app.use(hpp());
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  routes.forEach((route) => {
    app.use('/', route.router);
  });

  app.use(errorMiddleware);

  swaggerConfig(app);

  return app;
};

const swaggerConfig = (app: express.Application) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'OMPHALOS backend',
        version: '1.0.0',
      },
    },
    apis: ['swagger.yaml'],
  };

  const openapiSpecification = swaggerJsdoc(options);

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));
};

export default expressConfig;
