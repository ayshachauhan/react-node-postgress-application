import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserStatus } from 'src/enums/status.enum';
import { UserType } from 'src/enums/userType.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is requried.' })
  password: string;

  @IsNotEmpty({ message: 'Practice id is required.' })
  practiceId: string;

  @IsNotEmpty({ message: 'userName is required.' })
  userName: string;

  @IsNotEmpty({ message: 'Status is required.' })
  status: UserStatus;

  @IsNotEmpty({ message: 'userType is required.' })
  userType: UserType;

  @IsOptional()
  userUrl: string;
}
