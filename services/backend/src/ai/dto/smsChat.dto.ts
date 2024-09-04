import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class smsChatDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty({ message: 'Question is required' })
  @ApiProperty()
  question: string;

  @ApiProperty({ default: 'openai' })
  type: 'openai' | 'customgpt';
}
