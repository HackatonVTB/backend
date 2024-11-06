import { CoreRequestCTX } from 'core/types-decorator';
import { throwErrorSimple } from 'core/utils/error';

export const queryValidator = async (ctx: CoreRequestCTX) => {
  if (!ctx.dtoQuerySchema) {
    ctx.next();
    return;
  }

  const resultParse = ctx.dtoQuerySchema.safeParse(ctx.query);

  if (resultParse.success) {
    ctx.dtoQuery = resultParse.data;
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
