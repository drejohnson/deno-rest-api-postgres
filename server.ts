import { Application } from "https:/deno.land/x/oak/mod.ts";
import { timer, logger, errorHandler } from "./middleware/middleware.ts";
import authRouter from "./routes/auth_router.ts";

const port = 5000;
const app = new Application();

// Server Middleware
app.use(timer);
app.use(logger);
app.use(errorHandler);

// Router Middleware
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

console.log(`Server listening on port ${port}`);

app.listen({ port });
