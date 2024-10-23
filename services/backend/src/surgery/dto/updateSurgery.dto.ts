import { ApiProperty } from '@nestjs/swagger';
import {
  CheckListOptions,
  SelectedSurgeryOption,
  SurgeryStatus,
} from '@packages/entities';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSurgeryDto {
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

  @IsNotEmpty()
  @ApiProperty()
  bodyPart: string;

  @IsNotEmpty()
  @ApiProperty()
  selectedSurgeryOptions: SelectedSurgeryOption;

  @ApiProperty()
  selectedCheckListOptions: CheckListOptions;

  @IsNotEmpty()
  ipAddress: string;

  @IsOptional()
  @ApiProperty()
  totalHospitalPricing: string;

  @IsOptional()
  @ApiProperty()
  totalProfessionalPricing: string;

  @IsOptional()
  @ApiProperty()
  surgeryOrder: number;

  @IsOptional()
  @ApiProperty()
  referrerId: string;

  @IsOptional()
  @ApiProperty()
  surgeryStatus: SurgeryStatus;
}
