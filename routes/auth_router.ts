import { Router } from "https://deno.land/x/oak/mod.ts";
import { register, login } from "../handlers/auth/auth.ts";

const authRouter = new Router();

authRouter
  // register route
  .post("/api/auth/register", register)
  // login route
  .post("/api/auth/login", login);

export default authRouter;
