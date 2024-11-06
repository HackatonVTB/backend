import { ZodType } from 'zod';

export enum ApiMethodTypes {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

//Ответ от сервера
export type ApiResponse = {
  code: number; //Код ответа
  description?: string; //Описание ответа
  bodySchema?: ZodType; //Тело ответа
};

export type SWMethodParseParamsRequest = {
  summary?: string; //Краткое описание
  description?: string; //Полное описание
  dtoBodySchema?: ZodType; //Схема Body
  dtoQuerySchema?: ZodType; //Схема query
  dtoPathParamsSchema?: ZodType; //Схема PATH параметров (/:id)
  dtoHeadersSchema?: ZodType; //Схема заголовков
  responseList?: ApiResponse[]; //Список возможных ответов от сервера
};
