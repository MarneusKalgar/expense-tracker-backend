// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      apiVersion?: ApiVersion;
      id?: string;
      user?: {
        email: string;
        userId: string;
      };
    }
  }
}
