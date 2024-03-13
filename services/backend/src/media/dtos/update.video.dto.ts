import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateVideoDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  urlEmbed?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  url?: string;
}
