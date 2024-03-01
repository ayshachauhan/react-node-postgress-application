import { IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  urlEmbed: string;

  @IsNotEmpty()
  url: string;
}
