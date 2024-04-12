import { ApiProperty } from '@nestjs/swagger';
import { PracticeStatus } from '@packages/entities/practice';
import { IsOptional } from 'class-validator';

export class PracticePatchDto {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  code: string;

  @IsOptional()
  @ApiProperty()
  status: PracticeStatus;
}
