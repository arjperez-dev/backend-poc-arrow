import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginUserUseCase } from '../application/auth/login-user.use-case';
import { RegisterUserUseCase } from '../application/auth/register-user.use-case';
import { PASSWORD_HASHER, TOKEN_SERVICE } from '../application/tokens';
import { BcryptPasswordHasher } from '../infrastructure/security/bcrypt-password-hasher';
import { JwtTokenService } from '../infrastructure/security/jwt-token.service';
import { AuthController } from '../interfaces/http/auth/auth.controller';
import { JwtAuthGuard } from '../interfaces/http/auth/jwt-auth.guard';
import { RolesGuard } from '../interfaces/http/auth/roles.guard';
import { UsersModule } from './users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'change-me-in-local-env',
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
  ],
  exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
