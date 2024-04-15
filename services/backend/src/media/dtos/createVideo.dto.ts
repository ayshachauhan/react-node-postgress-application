import { ApiProperty } from '@nestjs/swagger';
import { SurgeryType } from '@packages/entities/template';
import { IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  urlEmbed: string;

  @IsNotEmpty()
  @ApiProperty()
  surgeryType: SurgeryType;

  @IsNotEmpty()
  @ApiProperty()
  url: string;
}
