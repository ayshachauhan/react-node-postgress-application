import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PracticePatchDto {
  @IsOptional()
  @ApiProperty()
  name: string;
}
