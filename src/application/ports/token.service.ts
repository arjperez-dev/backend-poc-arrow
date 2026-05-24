import { AuthenticatedUser } from '../auth/auth.types';

export interface TokenService {
  sign(user: AuthenticatedUser): Promise<string>;
}
