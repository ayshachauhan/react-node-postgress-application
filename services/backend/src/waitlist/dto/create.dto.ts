import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class WaitlistCreateDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;
}
