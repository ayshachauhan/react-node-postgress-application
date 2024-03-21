import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PracticeStatus } from 'src/enums/status.enum';

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

  @IsNotEmpty({ message: 'status is required' })
  @ApiProperty()
  status: PracticeStatus;

  @IsNotEmpty({ message: 'physician email  is required' })
  @ApiProperty()
  physicianEmail: string;

  @IsNotEmpty({ message: 'physician contact number is required' })
  @ApiProperty()
  physicianContactNumber: string;

  @IsOptional()
  @ApiProperty()
  photoUrl: string;
}
