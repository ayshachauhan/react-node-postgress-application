import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PracticeCreateDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'code is required' })
  @ApiProperty()
  code: string;

  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  adminEmail: string;

  @IsNotEmpty({ message: 'first name is required' })
  @ApiProperty()
  adminFirstName: string;

  @IsNotEmpty({ message: 'last name is required' })
  @ApiProperty()
  adminLastName: string;

  @IsNotEmpty({ message: 'contact number  is required' })
  @ApiProperty()
  adminContactNumber: string;

  @IsOptional()
  @ApiProperty()
  photoUrl: string;
}
