import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateCalendarDto {
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsNotEmpty()
  @ApiProperty()
  availableSlots: number;

  @IsNotEmpty()
  @ApiProperty()
  @Max(14)
  @Min(0)
  maxSlots: number;
}

export class UpdateCalendarDto {
  @IsNotEmpty()
  @ApiProperty()
  availableSlots: number;

  @IsNotEmpty()
  @ApiProperty()
  @Max(14)
  @Min(0)
  maxSlots: number;
}
