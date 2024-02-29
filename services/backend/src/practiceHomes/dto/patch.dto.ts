import { IsOptional, IsUUID } from 'class-validator';

export class PracticeHomePatchDto {
  @IsOptional()
  @IsUUID('4')
  practiceId: string;

  @IsOptional()
  name: string;
}
