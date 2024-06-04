import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty({ message: 'name is required' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'urlEmbed is required' })
  @ApiProperty()
  urlEmbed: string;

  @IsNotEmpty({ message: 'surgeryConfiguration is required' })
  @ApiProperty()
  surgeryConfigurationId: string;

  @IsNotEmpty({ message: 'url is required' })
  @ApiProperty()
  url: string;
}
