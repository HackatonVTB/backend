import { ZodType } from 'zod';

export function swMessage200(message: string = 'Ok') {
  return {
    code: 200,
    body: {
      message,
    },
  };
}

export function swBody200(bodySchema: ZodType, description?: string) {
  return {
    code: 200,
    description,
    bodySchema,
  };
}
