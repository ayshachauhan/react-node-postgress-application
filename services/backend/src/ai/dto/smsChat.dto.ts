import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class smsChatDto {
  @ApiProperty()
  From: string;

  @ApiProperty()
  Body: string;

  @IsOptional()
  @ApiProperty()
  SmsMessageSid: string;

  @IsOptional()
  @ApiProperty()
  NumMedia: string;

  @IsOptional()
  @ApiProperty()
  SmsSid: string;

  @IsOptional()
  @ApiProperty()
  SmsStatus: string;

  @IsOptional()
  @ApiProperty()
  NumSegments: string;

  @IsOptional()
  @ApiProperty()
  MessageSid: string;

  @IsOptional()
  @ApiProperty()
  AccountSid: string;

  @ApiProperty()
  To: string;

  @IsOptional()
  @ApiProperty()
  ApiVersion: string;

  @IsOptional()
  @ApiProperty()
  ToCountry: string;

  @IsOptional()
  @ApiProperty()
  ToState: string;

  @IsOptional()
  @ApiProperty()
  ToCity: string;

  @IsOptional()
  @ApiProperty()
  FromZip: string;

  @IsOptional()
  @ApiProperty()
  FromState: string;

  @IsOptional()
  @ApiProperty()
  FromCity: string;

  @IsOptional()
  @ApiProperty()
  FromCountry: string;

  @IsOptional()
  @ApiProperty()
  MessagingServiceSid: string;

  @IsOptional()
  @ApiProperty()
  ToZip: string;
}
