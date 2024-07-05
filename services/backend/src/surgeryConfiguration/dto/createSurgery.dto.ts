import { ApiProperty } from '@nestjs/swagger';
import {
  SurgeryChecklist,
  SurgeryConditionalOptions,
  SurgeryOptions,
} from '@packages/entities';
import { IsNotEmpty } from 'class-validator';

export class AddSurgeryConfigurationDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @ApiProperty()
  bodyPart: string[];

  @ApiProperty()
  facility: string[];

  @ApiProperty()
  options: SurgeryOptions;

  @ApiProperty()
  conditionalOptions: SurgeryConditionalOptions;

  @ApiProperty()
  checkList: SurgeryChecklist;

  @IsNotEmpty({ message: 'Color is required' })
  @ApiProperty()
  color: string;
}

export class UpdateSurgeryConfigurationDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  bodyPart: string[];

  @ApiProperty()
  facility: string[];

  @ApiProperty()
  options: SurgeryOptions;

  @ApiProperty()
  checkList: SurgeryChecklist;

  @ApiProperty()
  conditionalOptions: SurgeryConditionalOptions;
}
