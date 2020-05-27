import { Schema } from "https://deno.land/x/nessie/mod.ts";

export const up = (schema: Schema): void => {
  schema.create("users", (t) => {
    t.text("id").primary();
    t.text("name").nullable();
    t.text("email").notNullable().unique();
    t.text("password").notNullable();
  });
};

export const down = (schema: Schema): void => {
  schema.drop("users");
};
