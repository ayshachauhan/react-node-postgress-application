import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class PracticeHomePatchDto {
  @IsOptional()
  @ApiProperty()
  name: string;
}
