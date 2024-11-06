import { CoreRequestCTX } from 'core/types-decorator';
import { throwErrorSimple } from 'core/utils/error';

export const pathParamsValidator = async (ctx: CoreRequestCTX) => {
  if (!ctx.dtoPathParamsSchema) {
    ctx.next();
    return;
  }

  const resultParse = ctx.dtoPathParamsSchema.safeParse(ctx.params);

  if (resultParse.success) {
    ctx.dtoPathParams = resultParse.data;
    ctx.next();
  } else {
    const errorMessage = resultParse.error.errors
      .map((el) => {
        return JSON.stringify({
          ...el,
          path: el.path[0],
        });
      })
      .join(';');
    throwErrorSimple(errorMessage);
  }
};
