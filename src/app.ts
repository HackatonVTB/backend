import { apiErrorHandler } from 'core/middlewares/api-error-handler';
import { apiLogger } from 'core/middlewares/api-logger';
import { swAddMethodList, swAddServerUrl, swaggerDOC } from 'core/swagger-doc';
import { logInfo } from 'core/utils/logger';
import cors from 'cors';
import { pgInit } from 'database/postgres/postgres-sequelize-client';
import express, { Request, Response } from 'express';
import http from 'http';
import ip from 'ip';
import { controllers } from 'modules/controllers';
import { cwd } from 'process';
import 'reflect-metadata';
import { CONSTANTS } from 'utils/constants';
import { getProcessEnv } from 'utils/utils-env-config';
import { apiNotFoundHandler } from './core/middlewares/api-not-found-handler';

const port = getProcessEnv().SERVER_PORT;
const IP = ip.address();
const expressApp = express();
const httpServer = http.createServer(expressApp);

//---

export async function appInit() {
  // testBuild();

  // await initDb();

  initMiddlewares();
  initLogger();
  initControllers();
  initSwagger();
  initErrorHandling();
}

export async function appListen() {
  httpServer.listen(port, () => {
    logInfo(`Service ready on address: http://${IP}:${port}`);
  });
}

export async function appCleanUp() {}

//---

async function initDb() {
  await pgInit({
    dbCreate: true,
    extensionsDrop: true,
    extensionsCreate: true,
    sync: true,
    constraintsCreate: true,
  });
}

function initMiddlewares() {
  expressApp.use(express.json());
  expressApp.use(cors());
}

function initLogger() {
  expressApp.use(apiLogger);
}

function initControllers() {
  expressApp.all('/test', async (_: Request, res: Response) => {
    res.status(200).json({
      message: `Service is working on port: ${port}`,
    });
  });

  controllers.forEach((el: any) => {
    expressApp.use(el.controllerPath, el.router);
    swAddMethodList(el.swMethodFullResultList);
  });
}

function initSwagger() {
  swAddServerUrl(getProcessEnv().SERVER_URL);
  expressApp.use(CONSTANTS.SWAGGER_DOCS, express.static(`${cwd()}/${CONSTANTS.SWAGGER_UI_DIST_PATH}`));
  expressApp.use(CONSTANTS.SWAGGER_JSON, (_1, res, _2) => res.json(swaggerDOC));
}

function initErrorHandling() {
  expressApp.use(apiNotFoundHandler);
  expressApp.use(apiErrorHandler);
}

//---
