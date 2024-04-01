import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PracticeStatus } from 'src/enums/status.enum';

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
