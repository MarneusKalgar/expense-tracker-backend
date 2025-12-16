import { Request } from "express";

declare global {
  interface RequestWithPayload extends Request {
    id?: string;
    user?: {
      email: string;
      userId: string;
    };
  }

  interface VersionedRequest extends Request {
    apiVersion?: ApiVersion;
  }
}
