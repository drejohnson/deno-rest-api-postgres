import { Context, Middleware, validateJwt } from "../deps.ts";
import { UserModel } from "../models/User.ts";
import { config } from "../config.ts";
import { User } from "../types.ts";

export const logger: Middleware = async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
};

export const timer: Middleware = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
};

// export const timer: Middleware = async (ctx, next) => {
//   const start = performance.now();
//   await next();
//   const duration = performance.now() - start;
//   ctx.response.headers.set("X-Response-Time", `${duration}ms`);
// };

// export const logger: Middleware = async (ctx, next) => {
//   const duration = ctx.response.headers.get("X-Response-Time");
//   await next();
//   console.log(`${ctx.request.method} ${ctx.request.url} - ${duration}ms`);
// };

export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Server error" };
  }
};

export const verifyToken = async (
  ctx: Context<{ user: Omit<User, "password"> | null }>,
  next: () => Promise<void>
) => {
  const token =
    ctx.request.headers.get("authorization")?.split("bearer ")?.[1] || "";

  if (!token) {
    ctx.response.status = 400;
    ctx.response.body = {
      msg: "Access Denied!",
    };
    return;
  }
  try {
    const verified = await validateJwt(token, config.JWT_SECRET, {
      isThrowing: false,
    });

    if (!verified) {
      ctx.state.user = null;
    }

    const user = await UserModel.findById(verified?.payload?.id! as string);

    if (!user) {
      ctx.state.user = null;
    }

    ctx.state.user = user;
    await next();
  } catch (error) {
    console.log(error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Server error" };
  }
};
