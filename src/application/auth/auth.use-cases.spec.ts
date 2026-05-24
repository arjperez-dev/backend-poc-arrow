import { LoginUserUseCase } from './login-user.use-case';
import { RegisterUserUseCase } from './register-user.use-case';
import { PasswordHasher } from '../ports/password-hasher';
import { TokenService } from '../ports/token.service';
import { CreateUserData, UserRepository } from '../ports/user.repository';
import { UserEntity } from '../../domain/users/user.entity';
import { UserRole } from '../../domain/users/user-role';

class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserEntity>();

  async create(data: CreateUserData): Promise<UserEntity> {
    const user: UserEntity = {
      id: `user-${this.users.size + 1}`,
      email: data.email,
      displayName: data.displayName,
      passwordHash: data.passwordHash,
      role: data.role ?? UserRole.PLAYER,
    };
    this.users.set(user.email, user);
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.get(email) ?? null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return [...this.users.values()].find((user) => user.id === id) ?? null;
  }
}

class FakePasswordHasher implements PasswordHasher {
  async hash(plainTextPassword: string): Promise<string> {
    return `hashed:${plainTextPassword}`;
  }

  async compare(plainTextPassword: string, passwordHash: string): Promise<boolean> {
    return passwordHash === `hashed:${plainTextPassword}`;
  }
}

class FakeTokenService implements TokenService {
  async sign(user: { id: string }): Promise<string> {
    return `token:${user.id}`;
  }
}

describe('Auth use cases', () => {
  it('should_register_user_when_email_is_available', async () => {
    // Arrange
    const users = new InMemoryUserRepository();
    const useCase = new RegisterUserUseCase(users, new FakePasswordHasher(), new FakeTokenService());

    // Act
    const result = await useCase.execute({
      email: 'Player@Example.com',
      displayName: 'Player',
      password: 'StrongPass123',
    });

    // Assert
    expect(result.accessToken).toBe('token:user-1');
    expect(result.user.email).toBe('player@example.com');
    expect(result.user.role).toBe(UserRole.PLAYER);
  });

  it('should_return_jwt_token_when_credentials_are_valid', async () => {
    // Arrange
    const users = new InMemoryUserRepository();
    await users.create({
      email: 'player@example.com',
      displayName: 'Player',
      passwordHash: 'hashed:StrongPass123',
    });
    const useCase = new LoginUserUseCase(users, new FakePasswordHasher(), new FakeTokenService());

    // Act
    const result = await useCase.execute({
      email: 'player@example.com',
      password: 'StrongPass123',
    });

    // Assert
    expect(result.accessToken).toBe('token:user-1');
  });
});
