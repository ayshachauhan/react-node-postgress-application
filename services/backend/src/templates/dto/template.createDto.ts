import { ApiProperty } from '@nestjs/swagger';
import { TemplateMessageType } from '@packages/entities/template';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class TemplateCreateDto {
  @IsNotEmpty({ message: 'MessageType is required' })
  @IsEnum(TemplateMessageType, { message: 'Invalid message type' })
  @ApiProperty()
  messageType: TemplateMessageType;

  @IsNotEmpty({ message: 'date offset is required' })
  @ApiProperty()
  dateOffset: string;

  @IsOptional()
  @ApiProperty()
  meridiem: string;

  @IsNotEmpty({ message: 'surgeryConfiguration is required' })
  @ApiProperty()
  surgeryConfigurationId: string;

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
