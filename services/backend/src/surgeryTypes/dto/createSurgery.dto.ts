import { ApiProperty } from '@nestjs/swagger';
import { SurgeryChecklist, SurgeryOptions } from '@packages/entities/*';
import { IsNotEmpty } from 'class-validator';

export class CreateSurgeryTypeDto {
  @IsNotEmpty({ message: 'Type is required' })
  @ApiProperty()
  type: string;
}

export class AddBodyPartToSurgeryTypeDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;
}

export class AddFacilityToSurgeryTypeDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;
}

export class AddChecklistToSurgeryTypeDto {
  @ApiProperty()
  checklist: SurgeryChecklist;
}

export class AddOptionToSurgeryTypeDto {
  @ApiProperty()
  option: SurgeryOptions;
}
