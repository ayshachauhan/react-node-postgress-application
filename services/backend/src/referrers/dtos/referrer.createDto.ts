import { ApiProperty } from '@nestjs/swagger';
import { ReferrerType } from '@packages/entities/referrer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReferrerDto {
  @IsNotEmpty({ message: 'Firstname is required' })
  @ApiProperty()
  firstName: string;

  @IsNotEmpty({ message: 'Lastname is required' })
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty()
  email: string;

  // @IsNotEmpty({ message: 'Referrer type is required' })
  @IsOptional()
  @ApiProperty()
  @IsEnum(ReferrerType)
  referrerType: ReferrerType;
}
