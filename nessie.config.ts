import { config } from "./config.ts";

const configPg = {
  migrationFolder: `./migrations`,
  connection: config.DB_CONFIG,
  dialect: "pg",
};

export default configPg;
