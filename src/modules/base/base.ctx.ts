import { CoreRequestCTX } from 'core/types-decorator';
import { z } from 'zod';

export const extrasSchema = z.object({
  userId: z.coerce.string(),
  companyId: z.coerce.string().nullable(),
});
export type ExtrasType = z.infer<typeof extrasSchema>; //QUERY

// export type ExtrasType = {
//   userId: string;
//   companyId: string;
// };

export type BaseRequestCTX = CoreRequestCTX<ExtrasType>;
