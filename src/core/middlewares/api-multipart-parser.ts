import { NextFunction, Request, Response } from 'express';

export function apiMultipartParser(req: Request, _: Response, next: NextFunction) {
  if (req.header('content-type') && req.header('content-type')!.includes('multipart/form-data;')) {
    if (req.body) {
      const newBody: any = {};
      Object.keys(req.body).forEach((key) => {
        try {
          let parsed = JSON.parse(req.body[key]);
          newBody[key] = parsed;
        } catch (error) {
          newBody[key] = req.body[key];
        }
      });
      req.body = newBody;
    }
  }
  next();
}
