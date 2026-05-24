import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../application/tokens';
import { PrismaModule } from '../infrastructure/database/prisma.module';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
