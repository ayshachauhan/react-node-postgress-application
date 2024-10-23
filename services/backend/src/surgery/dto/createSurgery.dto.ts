import { ApiProperty } from '@nestjs/swagger';
import { SelectedSurgeryOption } from '@packages/entities';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSurgeryDto {
  @IsNotEmpty({ message: 'surgeryConfiguration is required' })
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

  @IsNotEmpty()
  @ApiProperty()
  bodyPart: string;

  @IsNotEmpty()
  @ApiProperty()
  selectedSurgeryOptions: SelectedSurgeryOption;

  @IsNotEmpty({ message: 'doctorId is required' })
  @ApiProperty()
  doctorId: string;

  @IsNotEmpty()
  ipAddress: string;

  @IsOptional()
  identifier: string;

  @IsOptional()
  count: number;
}
