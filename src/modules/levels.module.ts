import { Module } from '@nestjs/common';
import { CreateLevelUseCase } from '../application/levels/create-level.use-case';
import { GetLevelByIdUseCase, GetLevelsUseCase } from '../application/levels/get-levels.use-case';
import { UpdateLevelUseCase } from '../application/levels/update-level.use-case';
import { LEVEL_REPOSITORY } from '../application/tokens';
import { PrismaModule } from '../infrastructure/database/prisma.module';
import { PrismaLevelRepository } from '../infrastructure/repositories/prisma-level.repository';
import { LevelsController } from '../interfaces/http/levels/levels.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LevelsController],
  providers: [
    GetLevelsUseCase,
    GetLevelByIdUseCase,
    CreateLevelUseCase,
    UpdateLevelUseCase,
    {
      provide: LEVEL_REPOSITORY,
      useClass: PrismaLevelRepository,
    },
  ],
})
export class LevelsModule {}
