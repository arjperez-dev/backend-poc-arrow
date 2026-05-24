import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { toPublicUser } from '../../domain/users/user.entity';
import { PASSWORD_HASHER, TOKEN_SERVICE, USER_REPOSITORY } from '../tokens';
import { PasswordHasher } from '../ports/password-hasher';
import { TokenService } from '../ports/token.service';
import { UserRepository } from '../ports/user.repository';
import { AuthResult } from './auth.types';

export type LoginUserCommand = {
  email: string;
  password: string;
};

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<AuthResult> {
    const email = command.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await this.passwordHasher.compare(command.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

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
