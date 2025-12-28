/**
 * Extracts the version number from an OpenAPI specification filename.
 *
 * @param {string} file - Filename in format "openapi.X.Y.yaml"
 * @returns {string} Version string (e.g., "1.0", "2.0") or "unknown" if pattern doesn't match
 * @example
 * getVersionFromFilename("openapi.1.0.yaml"); // Returns: "1.0"
 * getVersionFromFilename("openapi.2.0.yaml"); // Returns: "2.0"
 */
export const getVersionFromFilename = (file: string): string => {
  const versionMatch = /openapi\.(\d+\.\d+)\.yaml/.exec(file);
  const version = versionMatch ? versionMatch[1] : "unknown";
  return version!;
};

/**
 * Extracts the filename from a URL path.
 *
 * @param {string} url - URL path containing the filename (e.g., "/api-specs/openapi.1.0.yaml")
 * @returns {string} The filename from the last segment of the URL
 * @example
 * getFileNameFromUrl("/api-specs/openapi.1.0.yaml"); // Returns: "openapi.1.0.yaml"
 */
export const getFileNameFromUrl = (url: string): string => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename ?? "";
};
