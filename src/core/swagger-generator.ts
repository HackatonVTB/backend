import { generateSchema } from '@anatine/zod-openapi';
import { OperationObject, ParameterLocation, ParameterObject, ResponseObject } from 'openapi3-ts/oas31';
import { ZodType } from 'zod';
import { SWMethodParseRequest, SWMethodParseResult } from './types-swagger';

//превращение данных в полный метод
export function swMethodParse(params: SWMethodParseRequest): SWMethodParseResult {
  const newPath = getSWPathName(params.controllerPath + params.methodPath);

  const method: OperationObject = {
    summary: params.methodParams.summary,
    description: params.methodParams.description,
    tags: [params.controllerPath],
    responses: {},
  };

  const parameters: ParameterObject[] = [];

  //Добавляем path переменные - это всегда будет СТРОКА
  if (params.methodParams.dtoPathParamsSchema) {
    const paramsList = parseParametrs('path', params.methodParams.dtoPathParamsSchema);
    parameters.push(...paramsList);
  }

  //Добавляем заголовки
  if (params.methodParams.dtoHeadersSchema) {
    const paramsList = parseParametrs('header', params.methodParams.dtoHeadersSchema);
    parameters.push(...paramsList);
  }

  //Добавляем query
  if (params.methodParams.dtoQuerySchema) {
    const paramsList = parseParametrs('query', params.methodParams.dtoQuerySchema);
    parameters.push(...paramsList);
  }

  method.parameters = parameters;

  if (params.methodParams.dtoBodySchema) {
    method.requestBody = {
      content: {
        'application/json': {
          schema: generateSchema(params.methodParams.dtoBodySchema),
        },
      },
    };
  }

  //API responses
  if (params.methodParams.responseList) {
    params.methodParams.responseList.forEach((el) => {
      const methodResponse: ResponseObject = {
        description: el.description ?? 'Response',
      };

      if (el.bodySchema) {
        methodResponse.content = {
          'application/json': {
            schema: generateSchema(el.bodySchema),
          },
        };
      }

      if (!method.responses) {
        method.responses = {};
      }

      method.responses[el.code.toString()] = methodResponse;
    });
  }

  return {
    tag: params.controllerPath,
    methodPath: newPath,
    methodType: params.methodType,
    method,
  };
}

function parseParametrs(inLocation: ParameterLocation, zodSchema: ZodType): ParameterObject[] {
  const resultList: ParameterObject[] = [];

  const swaggerObj = generateSchema(zodSchema);
  const requiredSet = new Set<string>(swaggerObj.required ? [...swaggerObj.required] : []);

  if (swaggerObj.properties) {
    Object.entries(swaggerObj.properties).forEach((el) => {
      //el = title; { type: 'string' },
      resultList.push({
        in: inLocation,
        name: el[0],
        required: requiredSet.has(el[0]),
        schema: {
          type: (el[1] as any).type,
          example: (el[1] as any).example,
        },
      });
    });
  }

  return resultList;
}

//Преобразование api/v1/users/:id -> api/v1/users/{id}
function getSWPathName(path: string) {
  return path
    .split('/')
    .map((el) => {
      if (el.startsWith(':')) {
        return `${el.replace(':', '{')}}`;
      }
      return el;
    })
    .join('/');
}
