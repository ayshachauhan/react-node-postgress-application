import { ApiProperty } from '@nestjs/swagger';
import { UserStatus, UserType } from '@packages/entities/user';
import { IsEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  userName: string;

  @IsOptional()
  @ApiProperty()
  designation: string;

  @IsEmpty()
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty()
  status: UserStatus;

  @IsOptional()
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
  @ApiProperty()
  contactNumber: string;
}
