import { CoreRequestCTX } from 'core/types-decorator';
import { throwErrorSimple } from 'core/utils/error';

export const bodyValidator = async (ctx: CoreRequestCTX) => {
  if (!ctx.dtoBodySchema) {
    ctx.next();
    return;
  }

  const resultParse = ctx.dtoBodySchema.safeParse(ctx.body);

  if (resultParse.success) {
    ctx.dtoBody = resultParse.data;
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
