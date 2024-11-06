import { OpenAPIObject } from 'openapi3-ts/oas31';
import { SWMethodParseResult } from './types-swagger';

export const swaggerDOC: OpenAPIObject = {
  openapi: '3.1.0',
  info: {
    title: 'Preview Api',
    description: 'This is a simple API',
    contact: {
      email: 'you@your-company.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
    version: '1.0.0',
  },
  tags: [],
  paths: {},
};

export function swAddServerUrl(serverUrl: string) {
  swaggerDOC.servers = [
    {
      url: serverUrl,
    },
  ];
}

export function swAddMethodList(swMethodParseResultList: SWMethodParseResult[]) {
  swMethodParseResultList.forEach((swMethodResult) => {
    const tagIndex = swaggerDOC.tags!.findIndex((el) => el.name === swMethodResult.tag);
    if (tagIndex === -1) {
      swaggerDOC.tags!.push({ name: swMethodResult.tag });
    }

    //Если такого пути еще нема - то добавляем новый
    if (swaggerDOC.paths && swaggerDOC.paths[swMethodResult.methodPath] === undefined) {
      swaggerDOC.paths[swMethodResult.methodPath] = {};
    }
    if (swaggerDOC.paths) {
      swaggerDOC.paths[swMethodResult.methodPath][swMethodResult.methodType] = swMethodResult.method;
    }
  });
}
