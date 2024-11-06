import { CoreRequestCTX } from 'core/types-decorator';
import { HttpError } from 'core/utils/error';
import { logError } from 'core/utils/logger';
import { NextFunction, Request, Response } from 'express';

export const apiErrorHandler = (err: Error, req: Request, res: Response, _: NextFunction) => {
  const tmp = req as CoreRequestCTX;

  const logData = tmp.logData ?? {};

  logError('API error', err, logData);

  let statusCode = 500;
  if (err instanceof HttpError) {
    if (typeof err.statusCode === 'number' && err.statusCode > 0) {
      statusCode = err.statusCode;
    }
  }

  let message = 'Неизвестная ошибка';
  if (typeof err.message === 'string' && err.message.length > 0) {
    message = err.message;
  }

  //Добавить errorData (что-то отправить на фронт КРОМЕ сообщения)

  res.status(statusCode).json({
    message,
  });
};
