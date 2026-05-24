import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserUseCase } from '../../../application/auth/login-user.use-case';
import { RegisterUserUseCase } from '../../../application/auth/register-user.use-case';
import { AuthResult } from '../../../application/auth/auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'Registers a new player and returns a JWT.' })
  async register(@Body() dto: RegisterDto): Promise<AuthResult> {
    return this.registerUser.execute(dto);
  }

  @Post('login')
  @ApiOkResponse({ description: 'Authenticates an existing user and returns a JWT.' })
  async login(@Body() dto: LoginDto): Promise<AuthResult> {
    return this.loginUser.execute(dto);
  }
}
