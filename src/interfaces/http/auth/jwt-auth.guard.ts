import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from '../../../application/auth/auth.types';
import { UserRole } from '../../../domain/users/user-role';
import { AuthenticatedRequest } from './authenticated-request';

type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = this.mapPayload(payload);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid bearer token.');
    }
  }

  private extractToken(authorizationHeader: string | undefined): string | null {
    const [type, token] = authorizationHeader?.split(' ') ?? [];
    return type === 'Bearer' && token ? token : null;
  }

  private mapPayload(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
