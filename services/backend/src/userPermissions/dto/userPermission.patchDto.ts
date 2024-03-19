import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserPermissionPatchDto {
  @IsNotEmpty({ message: 'userId is required' })
  @ApiProperty()
  userId: string;

  @IsNotEmpty({ message: 'permissionId is required' })
  @ApiProperty()
  permissionId: string;

  @IsNotEmpty({ message: 'PracticeId is required' })
  @ApiProperty()
  practiceId: string;

  @IsNotEmpty({ message: 'userPermissionId is required' })
  @ApiProperty()
  id: string;
}
