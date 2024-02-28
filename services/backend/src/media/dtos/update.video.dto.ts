import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateVideoDto {

  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  urlEmbed?: string;
  
  @IsOptional()
  @IsNotEmpty()
  url?: string;
}
