import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class smsChatDto {
  @ApiProperty()
  @IsOptional()
  ToCountry: string;

  @ApiProperty()
  @IsOptional()
  ToState: string;

  @ApiProperty()
  @IsOptional()
  SmsMessageSid: string;

  @ApiProperty()
  @IsOptional()
  NumMedia: string;

  @IsOptional()
  @ApiProperty()
  ToCity: string;

  @ApiProperty()
  @IsOptional()
  FromZip: string;

  @ApiProperty()
  @IsOptional()
  SmsSid: string;

  @ApiProperty()
  @IsOptional()
  FromState: string;

  @ApiProperty()
  @IsOptional()
  SmsStatus: string;

  @ApiProperty()
  @IsOptional()
  FromCity: string;

  @ApiProperty()
  Body: string;

  @ApiProperty()
  @IsOptional()
  FromCountry: string;

  @ApiProperty()
  To: string;

  @ApiProperty()
  MessagingServiceSid: string;

  @IsOptional()
  @ApiProperty()
  ToZip: string;

  @ApiProperty()
  @IsOptional()
  NumSegments: string;

  @ApiProperty()
  MessageSid: string;

  @ApiProperty()
  AccountSid: string;

  @ApiProperty()
  From: string;

  @ApiProperty()
  ApiVersion: string;
}
