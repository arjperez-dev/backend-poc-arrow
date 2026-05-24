import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserRole } from '../../domain/users/user-role';
import { toPublicUser } from '../../domain/users/user.entity';
import { PASSWORD_HASHER, TOKEN_SERVICE, USER_REPOSITORY } from '../tokens';
import { PasswordHasher } from '../ports/password-hasher';
import { TokenService } from '../ports/token.service';
import { UserRepository } from '../ports/user.repository';
import { AuthResult } from './auth.types';

export type RegisterUserCommand = {
  email: string;
  displayName: string;
  password: string;
};

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<AuthResult> {
    const email = command.email.trim().toLowerCase();
    const existingUser = await this.users.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = await this.passwordHasher.hash(command.password);
    const user = await this.users.create({
      email,
      displayName: command.displayName.trim(),
      passwordHash,
      role: UserRole.PLAYER,
    });
    const accessToken = await this.tokenService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: toPublicUser(user),
    };
  }
}
