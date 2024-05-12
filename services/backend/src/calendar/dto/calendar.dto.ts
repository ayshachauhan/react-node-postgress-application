import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateCalendarDto {
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsOptional()
  @ApiProperty()
  @Min(0)
  @Max(14)
  bookedSlots: number;

  @IsNotEmpty()
  @ApiProperty()
  @Max(14)
  @Min(0)
  maxSlots: number;

  @IsNotEmpty()
  @ApiProperty()
  surgeryConfigurationId: string;
}

export class UpdateCalendarDto {
  @IsOptional()
  @ApiProperty()
  bookedSlots?: number;

  @IsOptional()
  @ApiProperty()
  @Max(14)
  @Min(0)
  maxSlots?: number;
}

export class UpdateCalendarsDto {
  data: {
    id: string;
    bookedSlots?: number;
    maxSlots?: number;
  }[];
}
