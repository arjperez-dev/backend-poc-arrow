import { Injectable } from '@nestjs/common';
import { Level as PrismaLevel, Prisma } from '@prisma/client';
import { LevelRepository, SaveLevelData } from '../../application/ports/level.repository';
import { GraphLevelDefinition } from '../../domain/levels/graph-level-definition';
import { LevelEntity } from '../../domain/levels/level.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaLevelRepository implements LevelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: SaveLevelData): Promise<LevelEntity> {
    const level = await this.prisma.level.create({
      data: {
        ...data,
        definitionJson: data.definitionJson as Prisma.InputJsonValue,
      },
    });

    return this.mapLevel(level);
  }

  async findAll(): Promise<LevelEntity[]> {
    const levels = await this.prisma.level.findMany({ orderBy: { number: 'asc' } });
    return levels.map((level) => this.mapLevel(level));
  }

  async findById(id: string): Promise<LevelEntity | null> {
    const level = await this.prisma.level.findUnique({ where: { id } });
    return level ? this.mapLevel(level) : null;
  }

  async findByNumber(number: number): Promise<LevelEntity | null> {
    const level = await this.prisma.level.findUnique({ where: { number } });
    return level ? this.mapLevel(level) : null;
  }

  async update(id: string, data: SaveLevelData): Promise<LevelEntity> {
    const level = await this.prisma.level.update({
      where: { id },
      data: {
        ...data,
        definitionJson: data.definitionJson as Prisma.InputJsonValue,
      },
    });

    return this.mapLevel(level);
  }

  private mapLevel(level: PrismaLevel): LevelEntity {
    return {
      id: level.id,
      number: level.number,
      name: level.name,
      difficulty: level.difficulty,
      generationType: level.generationType,
      seed: level.seed,
      definitionJson: level.definitionJson as GraphLevelDefinition,
      createdAt: level.createdAt,
      updatedAt: level.updatedAt,
    };
  }
}
