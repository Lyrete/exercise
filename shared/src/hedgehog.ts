import { z } from "zod";

export enum Sex {
  Male = "male",
  Female = "female",
}

/**
 * Hedgehog interface shared between server and client
 */

export const hedgehogSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  age: z.number().nullable(),
  sex: z.nativeEnum(Sex).nullable(),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2),
    crs: z.object({}),
  }),
});

// zod doesnt play nice with geojson types
export const hedgehogFeature = z.object({
  type: z.literal("Feature"),
  properties: z.object({
    id: z.number(),
    name: z.string().nullable(),
    age: z.number().nullable(),
    sex: z.nativeEnum(Sex).nullable(),
  }),
  geometry: z.object({
    coordinates: z.number().array(),
    type: z.literal("Point"),
    crs: z.object({}),
  }),
});

export type Hedgehog = z.infer<typeof hedgehogSchema>;
export type HedgehogFeature = z.infer<typeof hedgehogFeature>;

export const newHedgehogSchema = hedgehogSchema
  .omit({ id: true })
  .extend({ location: z.array(z.number()).length(2) });
export type NewHedgehog = z.infer<typeof newHedgehogSchema>;
