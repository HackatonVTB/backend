import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';
import { ApiMethodTypes, ApiResponse, SWMethodParseParamsRequest } from './types';

export type CoreRequestCTX<
  DTO_EXTRAS = any,
  DTO_BODY = any,
  DTO_QUERY = any,
  DTO_PATH_PARAMS = any,
  DTO_HEADERS = any
> = {
  res: Response;
  next: NextFunction;
  dtoExtras: DTO_EXTRAS;
  dtoBody: DTO_BODY;
  dtoBodySchema?: ZodType<DTO_BODY>;
  dtoQuery: DTO_QUERY;
  dtoQuerySchema?: ZodType<DTO_QUERY>;
  dtoPathParams: DTO_PATH_PARAMS;
  dtoPathParamsSchema?: ZodType<DTO_PATH_PARAMS>;
  dtoHeaders: DTO_HEADERS;
  dtoHeadersSchema?: ZodType<DTO_HEADERS>;
  logData?: Record<string, any>;
} & Request;

export type RouteParams<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS> = {
  path: string;
  func: HandlerReturnType<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>;
  dtoBodySchema?: ZodType<DTO_BODY>; //Схема Body
  dtoQuerySchema?: ZodType<DTO_QUERY>; //Схема query
  dtoPathParamsSchema?: ZodType<DTO_PATH_PARAMS>; //Схема PATH параметров (/:id)
  dtoHeadersSchema?: ZodType<DTO_HEADERS>; //Схема заголовков
  handlers?: HandlerListType<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>; //Дополнительные обработчики запроса (В массиве)
  summary?: string; //Краткое описание
  description?: string; //Полное описание
  responseList?: ApiResponse[]; //Список возможных ответов от сервера
};

export type HandlerListType<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS> = Array<
  HandlerType<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>
>;

export type HandlerType<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS> = (
  ctx: CoreRequestCTX<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>
) => Promise<void>;

export type HandlerReturnType<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS> = (
  ctx: CoreRequestCTX<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>
) => Promise<void> | Promise<Record<string, any>>;

export type ExpressHandlerType = (req: Request, res: Response, next: NextFunction) => void;

export type DecoratorMethodReadyFullType = {
  methodType: ApiMethodTypes;
  methodPath: string;
  handlerList: ExpressHandlerType[];
  swParamsExtra: SWMethodParseParamsRequest;
};
