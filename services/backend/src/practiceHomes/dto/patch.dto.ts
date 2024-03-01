import { IsOptional } from 'class-validator';

export class PracticeHomePatchDto {
  @IsOptional()
  name: string;
}
