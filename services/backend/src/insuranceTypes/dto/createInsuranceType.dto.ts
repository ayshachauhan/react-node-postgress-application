import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateInsuranceTypeDto {
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty()
  name: string;
}
