import { db } from "../db/postgres.ts";
import { makeJwt, Jose, Payload, bcrypt, setExpiration } from "../deps.ts";
import { User } from "../types.ts";
import { config } from "../config.ts";

export class UserModel {
  static async createUser(user: User): Promise<User> {
    const result = await db.query(
      "insert into users (id, email, password) values ($1, $2, $3) returning id, email",
      user.id,
      user.email,
      user.password
    );
    console.log("user from createUser: ", result.rowsOfObjects()[0]);
    return result.rowsOfObjects()[0] as User;
  }

  static async findBy(
    column: string,
    value: string | number
  ): Promise<User | null> {
    const result = await db.query(
      `select * from users where ${column} = $1`,
      value
    );
    if (!result) return null;
    return result.rowsOfObjects()[0] as User;
  }

  static async findAll() {
    const result = await db.query("SELECT * FROM users ORDER BY id");
    return result.rowsOfObjects();
  }

  static async findById(id: string): Promise<Omit<User, "password"> | null> {
    const user = await this.findBy("id", id);
    return user;
  }

  static async findByEmail(
    email: string
  ): Promise<Omit<User, "password"> | null> {
    const user = await this.findBy("email", email);
    return user;
  }

  async delete(id: string) {
    return db.query(`DELETE FROM reviews_table WHERE id = $1`, id);
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async checkPassword(
    user: User,
    incomingPass: string
  ): Promise<Boolean> {
    return await bcrypt.compare(incomingPass, user.password);
  }

  static async generateToken(user: User): Promise<string> {
    const payload: Payload = {
      id: user.id,
      exp: setExpiration(new Date().getTime() + 3600 * 1000),
    };
    const header: Jose = {
      alg: "HS256",
      typ: "JWT",
    };
    return makeJwt({ header, payload, key: config.JWT_SECRET });
  }
}
