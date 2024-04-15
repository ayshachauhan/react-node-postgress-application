import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'MRN is required' })
  @ApiProperty()
  mrn: string;

  @IsNotEmpty({ message: 'first name is required' })
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty({ message: 'email name is required' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'contact number is required' })
  @ApiProperty()
  phoneNumber: string;

  @IsOptional()
  @ApiProperty()
  pcp: string;

  @IsOptional()
  @ApiProperty()
  referrer: string;
}
