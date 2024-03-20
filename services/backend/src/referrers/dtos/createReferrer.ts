import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum ReferrerTypeEnum {
  PCP = 'PCP',
  ORTHO = 'ORTHO',
  SURGEON = 'SURGEON',
}

export class CreateReferrerDto {
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(ReferrerTypeEnum)
  referrerType: ReferrerTypeEnum;
}

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
  @IsEnum(ReferrerTypeEnum)
  referrerType?: ReferrerTypeEnum;
}
