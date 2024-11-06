import { throwErrorNotFound } from 'core/utils/error';
import { NextFunction, Request, Response } from 'express';

export const apiNotFoundHandler = (req: Request, _: Response, next: NextFunction) => {
  next(throwErrorNotFound(`Not found - ${req.originalUrl} ${req.method}`));
};
