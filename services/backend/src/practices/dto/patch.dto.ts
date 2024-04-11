import { PracticeStatus } from '@entities/index';
import { ApiProperty } from '@nestjs/swagger';
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
