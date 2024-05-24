import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeDeleted: boolean;

  @IsOptional()
  monthQueryParam: string;

  @IsOptional()
  searchMRNName: string;

  @IsOptional()
  option: string;
}
