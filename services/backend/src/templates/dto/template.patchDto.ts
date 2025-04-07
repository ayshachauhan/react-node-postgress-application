import { ApiProperty } from '@nestjs/swagger';
import { TemplateMessageType } from '@packages/entities/template';
import { IsEnum, IsOptional } from 'class-validator';

export class TemplatePatchDto {
  @IsOptional()
  @IsEnum(TemplateMessageType, { message: 'Invalid message type' })
  @ApiProperty()
  messageType: TemplateMessageType;

  @IsOptional()
  @ApiProperty()
  dateOffset: string;

  @IsOptional()
  @ApiProperty()
  meridiem: string;

  @IsOptional()
  @ApiProperty()
  surgeryConfiguration: string;

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
