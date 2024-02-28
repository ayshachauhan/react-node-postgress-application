import { IsNotEmpty, IsUUID } from 'class-validator';

export class PracticeHomeCreateDto {
  @IsNotEmpty({ message: 'praticeId is required' })
  @IsUUID('4')
  practiceId: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
