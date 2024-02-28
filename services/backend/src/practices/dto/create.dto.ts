// patch.dto.ts
import { IsNotEmpty } from 'class-validator';

export class PracticeCreateDto {
  // Define properties to be created in the CREATE request
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  // Add more properties as needed
}
