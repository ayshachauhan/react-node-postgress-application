import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class PracticeHomeCreateDto {

  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;
}
