import { getPool } from "@server/db";
import { logger } from "@server/logging";
import {
  hedgehogSchema,
  NewHedgehog,
  newHedgehogSchema,
} from "@shared/hedgehog";
import { sql } from "slonik";

export async function getAllHedgehogs() {
  try {
    const hedgehogs = await getPool().any(
      sql.type(hedgehogSchema)`SELECT * FROM hedgehog`
    );

    return hedgehogs;
  } catch (error) {
    logger.error(error);
  }
}

export async function getHedgehog(id: number) {
  try {
    const [hedgehog] = await getPool().any(
      sql.type(
        hedgehogSchema
      )`SELECT *, ST_AsGeoJSON(location)::json as location FROM hedgehog WHERE id = ${id}`
    );

    if (!hedgehog) {
      return null;
    }

    return hedgehog;
  } catch (error) {
    logger.error(error);
  }
}

export async function addHedgehog(newHedgehog: NewHedgehog) {
  try {
    const [res] = await getPool().any(
      sql.type(
        hedgehogSchema
      )`INSERT INTO hedgehog (name, sex, age, location) VALUES (${
        newHedgehog.name
      }, ${newHedgehog.sex}, ${
        newHedgehog.age
      }, ${sql.unsafe`ST_Point(${newHedgehog.location[0]}, ${newHedgehog.location[1]})`}) RETURNING *, ST_AsGeoJson(location)::json as location;`
    );

    return res;
  } catch (error) {
    logger.error(error);
  }
}
