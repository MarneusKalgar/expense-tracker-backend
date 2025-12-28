import { Request } from "express";

export enum ApiVersion {
  V1 = "v1",
  V2 = "v2",
}

/**
 * Extract API version from request
 * Supports multiple methods: URL path, header, query parameter
 */
export const getApiVersion = (req: Request): ApiVersion => {
  // 1. Check URL path (e.g., /api/v1/users)
  const pathMatch = /\/v(\d+)\//.exec(req.path);
  if (pathMatch) {
    const version = `v${pathMatch[1]}`;
    if (Object.values(ApiVersion).includes(version as ApiVersion)) {
      return version as ApiVersion;
    }
  }

  // 2. Check Accept header (e.g., Accept: application/vnd.api.v1+json)
  const acceptHeader = req.headers.accept;
  if (acceptHeader) {
    const headerMatch = /application\/vnd\.api\.(v\d+)\+json/.exec(acceptHeader);
    if (headerMatch && Object.values(ApiVersion).includes(headerMatch[1] as ApiVersion)) {
      return headerMatch[1] as ApiVersion;
    }
  }

  // 3. Check custom version header (e.g., X-API-Version: v1)
  const versionHeader = req.headers["x-api-version"] as string;
  if (versionHeader) {
    const normalizedHeader = versionHeader.toLowerCase();
    if (Object.values(ApiVersion).includes(normalizedHeader as ApiVersion)) {
      return normalizedHeader as ApiVersion;
    }
  }

  // 4. Check query parameter (e.g., ?version=v1)
  const versionQuery = req.query.version as string;
  if (versionQuery) {
    const normalizedQuery = versionQuery.toLowerCase();
    if (Object.values(ApiVersion).includes(normalizedQuery as ApiVersion)) {
      return normalizedQuery as ApiVersion;
    }
  }

  // Default to v1
  return ApiVersion.V1;
};

/**
 * Check if request is for a specific API version.
 *
 * @param {Request} req - Express request object
 * @param {ApiVersion} version - The API version to check against
 * @returns {boolean} True if the request is for the specified version
 * @example
 * if (isApiVersion(req, ApiVersion.V2)) {
 *   // Handle v2-specific logic
 * }
 */
export const isApiVersion = (req: Request, version: ApiVersion): boolean => {
  return getApiVersion(req) === version;
};
