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
  if (versionHeader && Object.values(ApiVersion).includes(versionHeader as ApiVersion)) {
    return versionHeader as ApiVersion;
  }

  // 4. Check query parameter (e.g., ?version=v1)
  const versionQuery = req.query.version as string;
  if (versionQuery && Object.values(ApiVersion).includes(versionQuery as ApiVersion)) {
    return versionQuery as ApiVersion;
  }

  // Default to v1
  return ApiVersion.V1;
};

/**
 * Check if request is for a specific API version
 */
export const isApiVersion = (req: Request, version: ApiVersion): boolean => {
  return getApiVersion(req) === version;
};
