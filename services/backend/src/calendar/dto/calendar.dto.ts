import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateCalendarDto {
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsNotEmpty()
  @ApiProperty()
  @Min(0)
  @Max(14)
  availableSlots: number;

  @IsNotEmpty()
  @ApiProperty()
  @Max(14)
  @Min(0)
  maxSlots: number;
}

export class UpdateCalendarDto {
  @IsOptional()
  @ApiProperty()
  availableSlots?: number;

  @IsOptional()
  @ApiProperty()
  @Max(14)
  @Min(0)
  maxSlots?: number;
}
