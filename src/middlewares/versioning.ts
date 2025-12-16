import { NextFunction, Request, Response } from "express";

import { ApiVersion, getApiVersion } from "@/utils/index.js";

/**
 * Middleware to detect and attach API version to request
 */
export const apiVersion = (req: Request, res: Response, next: NextFunction) => {
  const versionedReq = req as VersionedRequest;
  versionedReq.apiVersion = getApiVersion(req);

  // Add version to response headers for transparency
  res.setHeader("X-API-Version", versionedReq.apiVersion);

  next();
};

/**
 * Middleware to enforce specific API version
 */
export const requireVersion = (version: ApiVersion) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestVersion = getApiVersion(req);

    if (requestVersion !== version) {
      return res.status(400).json({
        error: "Invalid API version",
        message: `This endpoint requires API version ${version}`,
        requestedVersion: requestVersion,
        supportedVersions: Object.values(ApiVersion),
      });
    }

    next();
  };
};

/**
 * Middleware to mark endpoint as deprecated
 */
export const deprecatedEndpoint = (options: {
  deprecatedIn: ApiVersion;
  message?: string;
  removedIn?: ApiVersion;
  useInstead?: string;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { deprecatedIn, message, removedIn, useInstead } = options;

    const warningParts = [`Deprecated in ${deprecatedIn}`];

    if (removedIn) {
      warningParts.push(`will be removed in ${removedIn}`);
    }

    if (useInstead) {
      warningParts.push(`use ${useInstead} instead`);
    }

    if (message) {
      warningParts.push(message);
    }

    res.setHeader("Warning", `299 - "${warningParts.join(". ")}"`);
    res.setHeader("Deprecation", "true");

    next();
  };
};
