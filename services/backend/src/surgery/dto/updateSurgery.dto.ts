import { ApiProperty } from '@nestjs/swagger';
import { CheckListOptions, SelectedSurgeryOption } from '@packages/entities';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSurgeryDto {
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
  totalHospitalPricing: number;

  @IsOptional()
  @ApiProperty()
  totalProfessionalPricing: number;
}
