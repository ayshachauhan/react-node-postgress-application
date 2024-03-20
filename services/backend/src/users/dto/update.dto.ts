import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsOptional } from 'class-validator';
import { UserStatus } from 'src/enums/status.enum';

import { UserType } from 'src/enums/userType.enum';

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
}
