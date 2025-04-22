import { ApiProperty } from '@nestjs/swagger';
import { ReferrerType } from '@packages/entities/referrer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class CreateReferrerDto {
  @IsNotEmpty({ message: 'Firstname is required' })
  @ApiProperty()
  firstName: string;

  @IsNotEmpty({ message: 'Lastname is required' })
  @ApiProperty()
  lastName: string;

  @ValidateIf((o) => o.email !== '')
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  @ApiProperty()
  email?: string;

  // @IsNotEmpty({ message: 'Referrer type is required' })
  @IsOptional()
  @ApiProperty()
  @IsEnum(ReferrerType)
  referrerType: ReferrerType;
}
