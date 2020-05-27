import { config as envConfig } from "https://deno.land/x/dotenv/mod.ts";
import { ConnectionOptions } from "https://deno.land/x/postgres/connection_params.ts";
import { Config } from "./types.ts";

envConfig({ safe: true, export: true });

const DB_CONFIG: ConnectionOptions = {
  hostname: Deno.env.get("DB_HOST"),
  port: +Deno.env.get("DB_PORT")!,
  user: Deno.env.get("DB_USER"),
  database: Deno.env.get("DB_DATABASE"),
  password: Deno.env.get("DB_PASSWORD"),
};

export const config: Config = {
  DB_CONFIG,
  JWT_SECRET: Deno.env.get("JWT_SECRET")!,
};
