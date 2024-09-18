import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class smsChatDto {
  @ApiProperty()
  from: string;

  @ApiProperty()
  body: string;

  @IsOptional()
  @ApiProperty()
  smsMessageSid: string;

  @IsOptional()
  @ApiProperty()
  numMedia: string;

  @IsOptional()
  @ApiProperty()
  smsSid: string;

  @IsOptional()
  @ApiProperty()
  smsStatus: string;

  @IsOptional()
  @ApiProperty()
  numSegments: string;

  @IsOptional()
  @ApiProperty()
  messageSid: string;

  @IsOptional()
  @ApiProperty()
  accountSid: string;

  @ApiProperty()
  to: string;

  @IsOptional()
  @ApiProperty()
  apiVersion: string;
}
