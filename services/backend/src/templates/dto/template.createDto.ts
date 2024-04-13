import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class TemplateCreateDto {
  @IsNotEmpty({ message: 'MessageType is required' })
  @ApiProperty()
  messageType: string;

  @IsNotEmpty({ message: 'date offset is required' })
  @ApiProperty()
  dateOffset: string;

  @IsOptional()
  @ApiProperty()
  meridiem: string;

  @IsNotEmpty({ message: 'surgeryType is required' })
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
