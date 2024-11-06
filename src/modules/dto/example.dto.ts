import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

//SWAGGER TESTS
export const examplePathSchema = extendApi(
  z.object({
    id: extendApi(z.string(), {
      example: '123456',
    }),
  })
);

export const exampleHeadersSchema = extendApi(
  z.object({
    apiToken: extendApi(z.string(), {
      example: 'asdadqdqwcqcq',
    }),
  })
);

export const exampleQuerySchema = extendApi(
  z.object({
    page: extendApi(z.number(), {
      example: '12',
    }),
    limit: extendApi(z.number(), {
      example: '120',
    }),
  })
);

export const exampleBodySchema = extendApi(
  z
    .object({
      title: z.string(),
      description: z.string().nonempty(),
      kek111: extendApi(z.number(), {
        example: '555-555-5555',
      }),
      asdad: z.object({
        ddd: z.coerce.boolean(),
      }),
    })
    .strict()
);

export const exampleRESBodySchema = extendApi(
  z
    .object({
      title: z.string(),
      description: z.string().nonempty(),
      kek111: extendApi(z.number(), {
        example: '555-555-5555',
      }),
      asdad: z.object({
        ddd: z.coerce.boolean(),
      }),
    })
    .strict()
);

//Default
export const exampleIdParamsSchema = z.object({
  id: z.coerce.string(),
});
export type ExampleIdParamsType = z.infer<typeof exampleIdParamsSchema>; //PARAMS

//get-all
export const exampleGetAllQuerySchema = z.object({
  title: z.coerce.string(),
});
export type ExampleGetAllQueryType = z.infer<typeof exampleGetAllQuerySchema>; //QUERY

//get-by-id

//post (create)
export const examplePostSchema = extendApi(
  z
    .object({
      title: z.string(),
      description: z.string().nonempty(),
      kek111: extendApi(z.number(), {
        example: '555-555-5555',
      }),
      // asdad: z.object({
      //   ddd: z.coerce.boolean(),
      // }),
    })
    .strict()
);
export type ExamplePostType = z.infer<typeof examplePostSchema>; //BODY

//Patch (Update)
export const examplePatchSchema = z.object({
  title: z.coerce.string(),
  description: z.coerce.string(),
});
export type ExamplePatchType = z.infer<typeof examplePatchSchema>; //BODY

//------

type TodoType = {
  title: string;
  completed: boolean;
};

type Swagger<T> = {
  a: string;
};

const example1 = {
  type: 'object',
  required: ['id', 'briefDescription', 'date', 'driverList'],
  properties: {
    id: {
      type: 'integer',
      example: 145,
    },
    briefDescription: {
      type: 'string',
      example: 'briefDescription',
    },
    date: {
      type: 'string',
      example: '2022-10-10',
    },
    vehicleIdList: {
      type: 'array',
      items: {
        type: 'integer',
        example: 123,
      },
    },
    driverList: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'addressId', 'nickname', 'type'],
        properties: {
          id: {
            type: 'integer',
            example: 145,
          },
          nickname: {
            type: 'string',
            example: 'Виталий Водитель',
          },
          type: {
            type: 'string',
            example: 'COMPANY/OWNER_OPERATOR', //FROM ENUM!!!
          },
        },
      },
    },
  },
};

// const TodoInput: Swagger<TodoType> = {
//   type: "object", // data type
//   properties: {
//     title: {
//       type: "string", // data type
//       description: "Todo's title", // desc
//       example: "Coding in JavaScript", // example of a title
//     },
//     completed: {
//       type: "boolean", // data type
//       description: "The status of the todo", // desc
//       example: false, // example of a completed value
//     },
//   },
// };
