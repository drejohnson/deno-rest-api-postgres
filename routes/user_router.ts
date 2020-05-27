import { Router } from "../deps.ts";
import { verifyToken } from "../middleware/middleware.ts";

import { getUser, getUsers } from "../handlers/user/user.ts";

const userRouter = new Router();

userRouter
  // get all users route
  .get("/api/users", verifyToken, getUsers)
  // get a user route
  .get("/api/users/:id", verifyToken, getUser);

export default userRouter;
