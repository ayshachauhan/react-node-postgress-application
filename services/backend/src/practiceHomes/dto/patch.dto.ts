import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PracticeHomePatchDto {
  @IsOptional()
  @ApiProperty()
  name: string;
}
