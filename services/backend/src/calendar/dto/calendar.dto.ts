import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateCalendarDto {
  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsOptional()
  @ApiProperty()
  @Min(0)
  @Max(99)
  bookedSlots: number;

  @IsNotEmpty()
  @ApiProperty()
  @Max(99)
  @Min(0)
  maxSlots: number;

  @IsNotEmpty()
  @ApiProperty()
  surgeryTypeId: string;

  @IsNotEmpty()
  @ApiProperty()
  bookedHours: string;
}

export class UpdateCalendarDto {
  @IsOptional()
  @ApiProperty()
  bookedSlots?: number;

  @IsOptional()
  @ApiProperty()
  @Max(99)
  @Min(0)
  maxSlots?: number;

  @IsOptional()
  @ApiProperty()
  bookedHours?: string;
}

export class UpdateCalendarsDto {
  data: {
    id: string;
    bookedSlots?: number;
    maxSlots?: number;
    surgeryTypeId?: string;
    bookedHours?: string;
  }[];
}
