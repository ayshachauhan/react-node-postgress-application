import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDesignation, UserStatus, UserType } from '@packages/entities/user';
import { Transform } from 'class-transformer';
import { IsEmpty, IsEnum, IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @ApiProperty()
  userName?: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsEnum(UserDesignation, { message: 'Invalid designation' })
  @ApiPropertyOptional({ enum: UserDesignation, nullable: true })
  designation?: UserDesignation | null;

  @IsEmpty()
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty()
  status: UserStatus;

  @IsOptional()
  @IsEnum(UserType, { message: 'Invalid user type' })
  @ApiProperty()
  type: UserType;

  @IsOptional()
  @ApiProperty()
  url: string;

  @IsOptional()
  @ApiProperty()
  permissionIds: string[];

  @IsOptional()
  @ApiProperty()
  imgUrl: string;

  @IsOptional()
  @Matches(/^\d{6,15}$/, {
    message: 'Contact number must contain 6–15 digits',
  })
  @ApiProperty()
  contactNumber: string;

  @IsOptional()
  @Matches(/^\+\d{1,4}$/, {
    message: 'Country code must start with + followed by 1–4 digits',
  })
  @ApiProperty()
  countryCode: string;

  @IsOptional()
  @ApiProperty()
  token: string;
}
