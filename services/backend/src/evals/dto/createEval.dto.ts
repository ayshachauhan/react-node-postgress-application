import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEvalDto {
  @IsNotEmpty({ message: 'surgeryType is required' })
  @ApiProperty()
  surgeryTypeId: string;

  @IsNotEmpty({ message: 'practice home id is required' })
  @ApiProperty()
  practiceHomeId: string;

  @IsOptional()
  @ApiProperty()
  insuranceTypeId: string;

  @IsOptional()
  @ApiProperty()
  insuranceDetails: string;

  @IsOptional()
  @ApiProperty()
  details: string;

  @IsNotEmpty({ message: 'eval date is required' })
  @ApiProperty()
  date: Date;

  @IsNotEmpty({ message: 'mrn is required' })
  @ApiProperty()
  mrn: string;

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

  @IsOptional()
  @ApiProperty()
  pcp: string;

  @IsOptional()
  @ApiProperty()
  referrer: string;

  @IsNotEmpty()
  @ApiProperty()
  eye: string;

  @IsNotEmpty()
  @ApiProperty()
  status: string;
}
