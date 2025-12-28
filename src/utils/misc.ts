import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const resolveFilePath = (filePath: string): string => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const docsPath = path.resolve(__dirname, filePath);
  return docsPath;
};

export const getFileContent = (
  filePath: string,
  filename: string,
  encoding: BufferEncoding = "utf8",
): string => {
  const fullPath = path.join(filePath, filename);
  const content = fs.readFileSync(fullPath, encoding);
  return content;
};
