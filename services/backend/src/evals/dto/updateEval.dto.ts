import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateEvalDto {
  @IsOptional()
  @ApiProperty()
  insuranceTypeId: string;

  @IsOptional()
  @ApiProperty()
  insuranceDetails: string;

  @IsOptional()
  @ApiProperty()
  notes: string;

  @IsNotEmpty({ message: 'eval date is required' })
  @ApiProperty()
  date: Date;

  @IsNotEmpty({ message: 'mrn is required' })
  @ApiProperty()
  mrn: number;

  @IsNotEmpty({ message: 'first name is required' })
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty({ message: 'email is required' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'contact number is required' })
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty({ message: 'country code is required' })
  @ApiProperty()
  countryCode: string;

  @IsOptional()
  @ApiProperty()
  pcp: string;

  @IsOptional()
  @ApiProperty()
  referrer: string;

  @IsNotEmpty()
  @ApiProperty()
  bodyPart: string;

  @IsNotEmpty()
  @ApiProperty()
  status: string;

  @IsNotEmpty()
  ipAddress: string;
}
