import { NextFunction, Request, Response, Router } from 'express';
import { apiAsyncHandler } from './middlewares/api-async-handler';
import { swMethodParse } from './swagger-generator';
import { ApiMethodTypes, SWMethodParseParamsRequest } from './types';
import { CoreRequestCTX, DecoratorMethodReadyFullType, ExpressHandlerType, RouteParams } from './types-decorator';
import { SWMethodParseResult } from './types-swagger';

export function ApiController(controllerPath: string) {
  return function (constructor: Function) {
    //constructor.prototype - сама сущность класса. Можно давить что угодно

    //Установого базового PATH
    constructor.prototype.controllerPath = controllerPath;

    //Создание ExppressRouter
    const router = Router();
    constructor.prototype.router = router;

    //SWMethodFullResult[]
    const swMethodFullResultList: SWMethodParseResult[] = [];
    constructor.prototype.swMethodFullResultList = swMethodFullResultList;

    //Список был создан в одном из первых декораторов
    const methodReadyFullList: DecoratorMethodReadyFullType[] = constructor.prototype.methodReadyFullList;

    methodReadyFullList.forEach((el) => {
      //Прикрепление к EXPRESS
      switch (el.methodType) {
        case ApiMethodTypes.GET:
          router.get(el.methodPath, el.handlerList);
          break;

        case ApiMethodTypes.POST:
          router.post(el.methodPath, el.handlerList);
          break;

        case ApiMethodTypes.PUT:
          router.put(el.methodPath, el.handlerList);
          break;

        case ApiMethodTypes.PATCH:
          router.patch(el.methodPath, el.handlerList);
          break;

        case ApiMethodTypes.DELETE:
          router.delete(el.methodPath, el.handlerList);
          break;
      }

      //Прикрепление к SWAGGER
      const swMethodFull = swMethodParse({
        controllerPath,
        methodPath: el.methodPath,
        methodType: el.methodType,
        methodParams: el.swParamsExtra,
      });

      swMethodFullResultList.push(swMethodFull);
    });
  };
}

export const Get = <DTO_EXTRAS = any, DTO_BODY = any, DTO_QUERY = any, DTO_PATH_PARAMS = any, DTO_HEADERS = any>(
  routeParams: RouteParams<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>
) => addMethod(ApiMethodTypes.GET, routeParams);

export const Post = <DTO_EXTRAS = any, DTO_BODY = any, DTO_QUERY = any, DTO_PATH_PARAMS = any, DTO_HEADERS = any>(
  routeParams: RouteParams<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>
) => addMethod(ApiMethodTypes.POST, routeParams);

export const Put = <DTO_EXTRAS = any, DTO_BODY = any, DTO_QUERY = any, DTO_PATH_PARAMS = any, DTO_HEADERS = any>(
  routeParams: RouteParams<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>
) => addMethod(ApiMethodTypes.PUT, routeParams);

export const Patch = <DTO_EXTRAS = any, DTO_BODY = any, DTO_QUERY = any, DTO_PATH_PARAMS = any, DTO_HEADERS = any>(
  routeParams: RouteParams<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>
) => addMethod(ApiMethodTypes.PATCH, routeParams);

export const Delete = <DTO_EXTRAS = any, DTO_BODY = any, DTO_QUERY = any, DTO_PATH_PARAMS = any, DTO_HEADERS = any>(
  routeParams: RouteParams<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>
) => addMethod(ApiMethodTypes.DELETE, routeParams);

function addMethod<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>(
  methodType: ApiMethodTypes,
  routeParams: RouteParams<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>
) {
  return function (constructor: Function) {
    //проверка, что еще в конструкторе НЕТ списка со всеми хендлерами
    if (!constructor.prototype.methodReadyFullList) {
      constructor.prototype.methodReadyFullList = [];
    }
    const methodReadyFullList: DecoratorMethodReadyFullType[] = constructor.prototype.methodReadyFullList;

    //Добавление хендлеров
    const handlerList: ExpressHandlerType[] = [];

    //1. метод для всех СХЕМ в КОНТЕКСТ запроса
    handlerList.push(
      apiAsyncHandler((req: Request, _: Response, next: NextFunction) => {
        const tmp = req as CoreRequestCTX<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>;

        tmp.dtoExtras = {} as DTO_EXTRAS;

        tmp.dtoBodySchema = routeParams.dtoBodySchema;
        tmp.dtoQuerySchema = routeParams.dtoQuerySchema;
        tmp.dtoPathParamsSchema = routeParams.dtoPathParamsSchema;
        tmp.dtoHeadersSchema = routeParams.dtoHeadersSchema;

        next();
      })
    );

    //2. Добавление всех методов
    if (routeParams.handlers !== undefined) {
      routeParams.handlers.forEach((handlerFunction) => {
        handlerList.push(
          apiAsyncHandler((req: Request, res: Response, next: NextFunction) => {
            const tmp = req as CoreRequestCTX<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>;
            tmp.next = next;
            tmp.res = res;
            return handlerFunction(tmp);
          })
        );
      });
    }

    //Добавление самого обработчика (ПОТЕНЦИАЛЬНО => return)
    handlerList.push(
      apiAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const tmp = req as CoreRequestCTX<DTO_EXTRAS, DTO_BODY, DTO_QUERY, DTO_PATH_PARAMS, DTO_HEADERS>;
        tmp.next = next;
        tmp.res = res;

        // HandlerReturnType
        const result = await routeParams.func(tmp);
        if (result !== undefined) {
          res.json(result);
        }
      })
    );

    //SWAGGER GENERTOR
    const swParamsExtra: SWMethodParseParamsRequest = {
      dtoPathParamsSchema: routeParams.dtoPathParamsSchema, //dto
      dtoHeadersSchema: routeParams.dtoHeadersSchema, //dto
      dtoQuerySchema: routeParams.dtoQuerySchema, //dto
      dtoBodySchema: routeParams.dtoBodySchema, //dto
      summary: routeParams.summary, //Название метода
      description: routeParams.description, //Описание метода
      responseList: routeParams.responseList,
    };

    //Добавление в конечный массив
    methodReadyFullList.unshift({
      methodType,
      methodPath: routeParams.path,
      handlerList,
      swParamsExtra,
    });
  };
}
