import { ApiProperty } from '@nestjs/swagger';
import { UserStatus, UserType } from '@packages/entities/user';
import { IsNotEmpty, IsOptional } from 'class-validator';

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

  @IsOptional()
  @ApiProperty()
  permissionIds: string[];
}
