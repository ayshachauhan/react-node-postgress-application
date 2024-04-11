import { ApiProperty } from '@nestjs/swagger';
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
  surgeryType: string;

  @IsNotEmpty()
  @ApiProperty()
  url: string;
}
