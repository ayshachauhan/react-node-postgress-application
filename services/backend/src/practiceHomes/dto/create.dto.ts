import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PracticeHomeCreateDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;
}
