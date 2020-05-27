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
  { request, response, state }: Context,
  next: () => Promise<void>
) => {
  const token =
    request.headers.get("authorization")?.split("bearer ")?.[1] || "";

  if (!token) {
    response.status = 401;
    response.body = {
      msg: "Access Denied!",
    };
    return;
  }

  try {
    const verified = await validateJwt(token, config.JWT_SECRET, {
      isThrowing: false,
    });

    if (!verified) {
      state.user = null;
    }

    const user = await UserModel.findById(verified?.payload?.id! as string);

    if (!user) {
      state.user = null;
      response.status = 401;
      response.body = {
        msg: "Access Denied!",
      };
      return;
    }

    state.user = user;
    await next();
  } catch (error) {
    console.log(error);
    response.status = 500;
    response.body = { error: "Server error" };
  }
};
