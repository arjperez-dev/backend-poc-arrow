import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateLevelUseCase } from '../../../application/levels/create-level.use-case';
import { GetLevelByIdUseCase, GetLevelsUseCase } from '../../../application/levels/get-levels.use-case';
import { UpdateLevelUseCase } from '../../../application/levels/update-level.use-case';
import { LevelEntity } from '../../../domain/levels/level.entity';
import { UserRole } from '../../../domain/users/user-role';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SaveLevelDto } from './dto/save-level.dto';

@ApiTags('levels')
@Controller('levels')
export class LevelsController {
  constructor(
    private readonly getLevels: GetLevelsUseCase,
    private readonly getLevelById: GetLevelByIdUseCase,
    private readonly createLevel: CreateLevelUseCase,
    private readonly updateLevel: UpdateLevelUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Returns graph-based level definitions.' })
  async findAll(): Promise<LevelEntity[]> {
    return this.getLevels.execute();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns one graph-based level definition.' })
  async findOne(@Param('id') id: string): Promise<LevelEntity> {
    return this.getLevelById.execute(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({ description: 'Creates a graph-based level definition. Requires ADMIN.' })
  async create(@Body() dto: SaveLevelDto): Promise<LevelEntity> {
    return this.createLevel.execute({
      ...dto,
      seed: dto.seed ?? null,
      definitionJson: dto.definitionJson,
    });
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ description: 'Updates a graph-based level definition. Requires ADMIN.' })
  async update(@Param('id') id: string, @Body() dto: SaveLevelDto): Promise<LevelEntity> {
    return this.updateLevel.execute(id, {
      ...dto,
      seed: dto.seed ?? null,
      definitionJson: dto.definitionJson,
    });
  }
}
