import { ApiProperty } from '@nestjs/swagger';
import { ReferrerType } from '@packages/entities/referrer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class updateReferrerDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  lastName?: string;

  @ValidateIf((o) => o.email !== '')
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional() // Allows undefined or null values
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(ReferrerType)
  referrerType?: ReferrerType;
}
