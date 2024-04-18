import { ApiProperty } from '@nestjs/swagger';
import { ReferrerType } from '@packages/entities/referrer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class updateReferrerDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(ReferrerType)
  referrerType?: ReferrerType;
}
