import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SurgeryType } from 'src/enums/surgeryType.enum';

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
