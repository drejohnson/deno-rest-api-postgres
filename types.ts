import { ConnectionOptions } from "https://deno.land/x/postgres/connection_params.ts";

export interface Config {
  DB_CONFIG: ConnectionOptions;
  JWT_SECRET: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  createdAt: string;
}

export interface Post {
  title: string;
  body: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
