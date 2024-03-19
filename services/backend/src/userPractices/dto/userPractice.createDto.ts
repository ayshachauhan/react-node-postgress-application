import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserPracticeCreateDto {
  @IsNotEmpty({ message: 'userId is required' })
  @ApiProperty()
  userId: string;

  @IsNotEmpty({ message: 'practiceId is required' })
  @ApiProperty()
  practiceId: string;
}
