import { Request } from 'express';
import { AuthenticatedUser } from '../../../application/auth/auth.types';

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
