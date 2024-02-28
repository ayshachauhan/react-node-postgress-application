import { IsUUID } from 'class-validator';

export class PracticeHomePatchDto {
  @IsUUID('4')
  practiceId?: string;

  name?: string;
}
