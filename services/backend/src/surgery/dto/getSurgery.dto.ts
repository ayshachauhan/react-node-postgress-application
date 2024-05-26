import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class QueryDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeDeleted: boolean;
}
