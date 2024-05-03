import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSurgeryTypeDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;
}
