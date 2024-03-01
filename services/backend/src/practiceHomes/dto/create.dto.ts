import { IsNotEmpty } from 'class-validator';

export class PracticeHomeCreateDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
