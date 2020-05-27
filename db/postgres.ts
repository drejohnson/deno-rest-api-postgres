import { Client } from "https://deno.land/x/postgres/mod.ts";
import { config } from "../config.ts";

export const db: Client = new Client(config.DB_CONFIG);

try {
  await db.connect();
  console.log("Connection to Database established");
} catch (error) {
  console.log("Connection error: ", error.stack);
  throw error;
}
