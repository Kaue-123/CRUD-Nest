import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: Record<string, unknown>;
}
