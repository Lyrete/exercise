import { z } from "zod";

/**
 * Hedgehog interface shared between server and client
 */

export const hedgehogSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  age: z.number().nullable(),
  sex: z.enum(["male", "female"]).nullable(),
  location: z.object({
    coordinates: z.number().array(),
    type: z.literal("Point"),
  }),
});

export type Hedgehog = z.infer<typeof hedgehogSchema>;
