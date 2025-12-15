import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";

import { env } from "@/configs/index.js";

export const getDefaultHash = () => {
  return bcrypt.hashSync(randomBytes(16).toString("hex"), env.bcrypt.saltRounds);
};
