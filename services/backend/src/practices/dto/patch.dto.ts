import { IsOptional } from 'class-validator';
export class PracticePatchDto {
  @IsOptional()
  name: string;
}
