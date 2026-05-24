import { PublicUser } from '../../domain/users/user.entity';
import { UserRole } from '../../domain/users/user-role';

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type AuthResult = {
  accessToken: string;
  user: PublicUser;
};
