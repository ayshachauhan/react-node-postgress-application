import { ApiProperty } from '@nestjs/swagger';
import { EVAL_STATUS } from '@packages/entities/eval';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEvalDto {
  @IsNotEmpty({ message: 'surgeryConfig is required' })
  @ApiProperty()
  surgeryConfigurationId: string;

  @IsNotEmpty({ message: 'patient home location is required' })
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
  @IsEmail({}, { message: 'Invalid email format' })
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

  @IsOptional()
  @ApiProperty()
  waitlistId: string;

  @IsNotEmpty()
  @ApiProperty()
  bodyPart: string;

  @IsNotEmpty()
  @IsEnum(EVAL_STATUS, { message: 'Invalid status' })
  @ApiProperty()
  status: EVAL_STATUS;

  @IsNotEmpty({ message: 'doctorId is required' })
  @ApiProperty()
  doctorId: string;

  @IsNotEmpty()
  ipAddress: string;
}
