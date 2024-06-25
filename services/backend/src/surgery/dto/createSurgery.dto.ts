import { ApiProperty } from '@nestjs/swagger';
import { SelectedSurgeryOption } from '@packages/entities';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
  details: string;

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
}
