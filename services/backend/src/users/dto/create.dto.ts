import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserStatus } from 'src/enums/status.enum';

import { UserType } from 'src/enums/userType.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty()
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty()
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'userName is required.' })
  @ApiProperty()
  userName: string;

  @IsNotEmpty({ message: 'Status is required.' })
  @ApiProperty()
  status: UserStatus;

  @IsNotEmpty({ message: 'userType is required.' })
  @ApiProperty()
  type: UserType;

  @IsOptional()
  @ApiProperty()
  url: string;

  @IsNotEmpty({ message: 'contact number is required' })
  @ApiProperty()
  contactNumber: string;
}
