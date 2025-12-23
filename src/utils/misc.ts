import path from "node:path";
import { fileURLToPath } from "node:url";

export const resolveFilePath = (filePath: string): string => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const docsPath = path.resolve(__dirname, filePath);
  return docsPath;
};
