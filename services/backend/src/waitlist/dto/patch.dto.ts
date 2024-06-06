import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class WaitlistPatchDto {
  @IsOptional()
  @ApiProperty()
  name: string;
}
