import { ApiController, Get } from 'core/api-decorators';
import { bodyValidator } from 'core/middlewares/validators/body-validator';
import { addName } from 'middlewares/add-name';
import {
  exampleBodySchema,
  exampleHeadersSchema,
  examplePathSchema,
  exampleQuerySchema,
  exampleRESBodySchema,
} from 'modules/dto/example.dto';
import { ExampleService } from 'modules/services/example.service';

@ApiController('/example')
@Get({
  path: '/',
  summary: 'asdasdasdsa',
  dtoBodySchema: exampleBodySchema,
  dtoPathParamsSchema: examplePathSchema,
  dtoHeadersSchema: exampleHeadersSchema,
  dtoQuerySchema: exampleQuerySchema,
  responseList: [
    {
      code: 200,
      bodySchema: exampleRESBodySchema,
    },
  ],
  handlers: [addName, bodyValidator],
  func: async (ctx) => {
    console.log('DTO_EXTRAS =', ctx.dtoExtras);
    const k = ctx.dtoBody;
    console.log('BODY =', k);

    // console.log('QUERY =', ctx.dtoQuery);
    const items = await ExampleService.getItems();
    // ctx.res.json(items);

    // throwErrorSimple('ssssssss');

    //Example with return type
    return {
      kek: 'asdf',
    };

    //Example with RES....
    // ctx.res.json({ message: 'Ok' });
  },
})
export class ExampleController {}
