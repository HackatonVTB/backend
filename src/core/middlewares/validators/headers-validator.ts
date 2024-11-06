import { CoreRequestCTX } from 'core/types-decorator';
import { throwErrorSimple } from 'core/utils/error';

export const headersValidator = async (ctx: CoreRequestCTX) => {
  if (!ctx.dtoHeadersSchema) {
    ctx.next();
    return;
  }

  const resultParse = ctx.dtoHeadersSchema.safeParse(ctx.headers);

  if (resultParse.success) {
    ctx.dtoHeaders = resultParse.data;
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
