import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

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

  @IsOptional()
  @ApiProperty()
  waitlistId: string;

  @IsNotEmpty()
  @ApiProperty()
  bodyPart: string;

  @IsNotEmpty()
  @ApiProperty()
  status: string;

  @IsNotEmpty({ message: 'doctorId is required' })
  @ApiProperty()
  doctorId: string;

  @IsNotEmpty()
  ipAddress: string;
}
