import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";

import { env } from "@/configs/index.js";

/**
 * Generates a default bcrypt hash from random bytes.
 * Used for generating secure random hashes for various purposes.
 *
 * @returns {string} A bcrypt hash of a 16-byte random hex string
 */
export const getDefaultHash = () => {
  return bcrypt.hashSync(randomBytes(16).toString("hex"), env.bcrypt.saltRounds);
};
