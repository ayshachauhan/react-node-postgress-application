import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserPracticePatchDto {
  @IsNotEmpty({ message: 'userId is required' })
  @ApiProperty()
  userId: string;

  @IsNotEmpty({ message: 'practiceId is required' })
  @ApiProperty()
  practiceId: string;

  @IsNotEmpty({ message: 'practiceId is required' })
  @ApiProperty()
  id: string;
}
