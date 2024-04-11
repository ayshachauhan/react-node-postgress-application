import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TemplatePatchDto {
  @IsOptional()
  @ApiProperty()
  messageType: string;

  @IsOptional()
  @ApiProperty()
  dateOffset: string;

  @IsOptional()
  @ApiProperty()
  meridiem: string;

  @IsOptional()
  @ApiProperty()
  surgeryType: string;

  @IsOptional()
  @ApiProperty()
  emailSubject: string;

  @IsOptional()
  @ApiProperty()
  emailBody: string;

  @IsOptional()
  @ApiProperty()
  emailAttachment: string;

  @IsOptional()
  @ApiProperty()
  email1stCataract: string;

  @IsOptional()
  @ApiProperty()
  email2ndCataract: string;

  @IsOptional()
  @ApiProperty()
  messageText: string;
}
