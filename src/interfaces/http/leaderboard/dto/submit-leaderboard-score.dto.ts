import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class SubmitLeaderboardScoreDto {
  @ApiProperty()
  @IsString()
  levelId!: string;

  @ApiProperty({ example: 1000 })
  @IsInt()
  @Min(0)
  score!: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(0)
  moves!: number;

  @ApiProperty({ example: 45 })
  @IsInt()
  @Min(0)
  timeSeconds!: number;
}
