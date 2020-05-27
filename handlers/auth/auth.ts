import { RouterContext, generated } from "../../deps.ts";
import { UserModel } from "../../models/User.ts";
import { User } from "../../types.ts";
import { validateUser } from "./validations.ts";

// @desc    Register new user
// @route   GET /api/auth/register
export const register = async ({ request, response }: RouterContext) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = { success: false, msg: "Invalid request : no body " };
      return;
    }

    const body: Omit<User, "id"> = (await request.body()).value;
    const { email, password } = body;

    if (!email || !password) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Please provide an email and password",
      };
      return;
    }

    const userId = await generated(
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
      12
    );
    // check if user already exists
    // if user exits return status 400 with message that User is already registered
    const userExist = await UserModel.findByEmail(email);
    if (userExist) {
      response.status = 400;
      response.body = {
        message: `User with email : ${email} already exist`,
      };
      return;
    }

    // validate user input
    const userInput = validateUser({ email, password });

    // Create new user
    const user = await UserModel.createUser({
      ...userInput,
      id: userId(),
      password: await UserModel.hashPassword(password),
    });
    const token = await UserModel.generateToken(user);
    // send new user in response body
    response.status = 201;
    response.body = {
      success: true,
      data: { user, token },
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      msg: error,
    };
  }
};

// @desc    Register new user
// @route   GET /api/auth/register
export const login = async ({ request, response }: RouterContext) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = { success: false, msg: "Invalid request : no body " };
      return;
    }

    const body: Omit<User, "id"> = (await request.body()).value;
    const { email, password } = body;

    if (!email || !password) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Please provide an email and password",
      };
      return;
    }

    // validate user input
    const userInput = validateUser({ email, password });

    const user = (await UserModel.findBy("email", userInput.email)) as User;

    if (user && (await UserModel.checkPassword(user, userInput.password))) {
      const token = await UserModel.generateToken(user);
      response.status = 200;
      response.body = {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      };
      return;
    }

    response.status = 400;
    response.body = {
      success: false,
      msg: "Invalid Credentials",
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      msg: error,
    };
  }
};
