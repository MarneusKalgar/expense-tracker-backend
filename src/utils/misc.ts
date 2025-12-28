import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolves a relative file path to an absolute path based on the current module location.
 * Useful in ES modules where __dirname is not available.
 *
 * @param {string} filePath - Relative path to resolve (e.g., "../docs/output")
 * @returns {string} Absolute path resolved from the current module directory
 * @example
 * const docsDir = resolveFilePath("../docs/output");
 * Returns: "/absolute/path/to/docs/output"
 */
export const resolveFilePath = (filePath: string): string => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const docsPath = path.resolve(__dirname, filePath);
  return docsPath;
};

/**
 * Reads and returns the content of a file synchronously.
 *
 * @param {string} filePath - Directory path containing the file
 * @param {string} filename - Name of the file to read
 * @param {BufferEncoding} encoding - File encoding (default: "utf8")
 * @returns {string} File content as a string
 * @throws {Error} If file doesn't exist or cannot be read
 * @example
 * const content = getFileContent("/path/to/dir", "file.yaml");
 */
export const getFileContent = (
  filePath: string,
  filename: string,
  encoding: BufferEncoding = "utf8",
): string => {
  const fullPath = path.join(filePath, filename);
  const content = fs.readFileSync(fullPath, encoding);
  return content;
};
