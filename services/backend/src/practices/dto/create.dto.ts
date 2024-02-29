import { IsNotEmpty } from 'class-validator';

export class PracticeCreateDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
