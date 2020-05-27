import { RouterContext } from "../../deps.ts";

import { UserModel } from "../../models/User.ts";

export const getUsers = async ({ response, state }: RouterContext) => {
  console.log("state from getUsers", state);
  const users = await UserModel.findAll();
  response.status = 200;
  response.body = {
    success: true,
    data: users,
  };
};

export const getUser = async ({ response, params }: RouterContext) => {
  const { id } = params;

  if (!id) {
    response.status = 400;
    response.body = { success: false, msg: "Invalid User ID" };
    return;
  }

  const user = await UserModel.findById(id);

  if (!user) {
    response.status = 404;
    response.body = { success: false, msg: `User with ID ${id} not found` };
    return;
  }

  response.status = 200;
  response.body = {
    success: true,
    data: user,
  };
};
