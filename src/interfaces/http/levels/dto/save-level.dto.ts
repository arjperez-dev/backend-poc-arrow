import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Difficulty, GenerationType } from '../../../../domain/levels/level.entity';

export class SaveLevelDto {
  @ApiProperty({ example: 16 })
  @IsInt()
  @Min(1)
  number!: number;

  @ApiProperty({ example: 'Admin Created Level' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ enum: ['easy', 'medium', 'hard'], example: 'easy' })
  @IsIn(['easy', 'medium', 'hard'])
  difficulty!: Difficulty;

  @ApiProperty({ enum: ['manual', 'random'], example: 'manual' })
  @IsIn(['manual', 'random'])
  generationType!: GenerationType;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsString()
  seed?: string | null;

  @ApiProperty({
    example: {
      nodes: [],
      edges: [],
      arrows: [],
      blockedEdges: [],
      metadata: {
        difficulty: 'easy',
        generationType: 'manual',
      },
    },
  })
  @IsObject()
  definitionJson!: Record<string, unknown>;
}
