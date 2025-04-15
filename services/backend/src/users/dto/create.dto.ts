import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDesignation, UserType } from '@packages/entities/user';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty()
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty()
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'userName is required.' })
  @ApiProperty()
  userName: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsEnum(UserDesignation, { message: 'Invalid designation' })
  @ApiPropertyOptional({ enum: UserDesignation })
  designation?: UserDesignation;

  @IsNotEmpty({ message: 'userType is required.' })
  @IsEnum(UserType, { message: 'Invalid user type' })
  @ApiProperty()
  type: UserType;

  @IsOptional()
  @ApiProperty()
  url: string;

  @IsNotEmpty({ message: 'contact number is required' })
  @ApiProperty()
  contactNumber: string;

  @IsNotEmpty({ message: 'country code is required' })
  @Matches(/^\+\d{1,4}$/, {
    message: 'Country code must start with + followed by 1–4 digits',
  })
  @ApiProperty()
  countryCode: string;

  @IsOptional()
  @ApiProperty()
  permissionIds: string[];
}
