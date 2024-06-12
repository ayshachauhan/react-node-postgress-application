import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class reviewRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  id?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  practiceId?: string;
}
