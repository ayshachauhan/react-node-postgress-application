import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSurgeryTypeDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Surgery Location Color is required' })
  @ApiProperty()
  color: string;
}

export class UpdateSurgeryTypeDto {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  color: string;
}
