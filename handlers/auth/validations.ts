import { vs } from "../../deps.ts";
import { User } from "../../types.ts";

// @desc    User validation schema
const authSchema = {
  name: vs.string({
    maxLength: {
      length: 20,
      trims: true,
    },
  }),
  email: vs.email({ trims: true }),
  password: vs.string({
    minLength: 8,
    trims: true,
    // requires the password must contain: 1 lower letter, 1 capital letter, 1 number and 1 special character
    // pattern: RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"),
  }),
};

// @desc    Validate User
export const validateUser = <T>(body: T): User => {
  return vs.applySchemaObject(
    {
      email: authSchema.email,
      password: authSchema.password,
    },
    body
  );
};
