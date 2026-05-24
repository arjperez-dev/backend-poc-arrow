import { UserEntity } from '../../domain/users/user.entity';
import { UserRole } from '../../domain/users/user-role';

export type CreateUserData = {
  email: string;
  displayName: string;
  passwordHash: string;
  role?: UserRole;
};

export interface UserRepository {
  create(data: CreateUserData): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}
