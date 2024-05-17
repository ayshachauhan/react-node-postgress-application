import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  emailStatus: string;

  @ApiProperty()
  emailType: string;

  @ApiProperty()
  emailDetail: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  mrn: string;

  @ApiProperty()
  caseId: string;

  @ApiProperty()
  emailOpen: boolean;

  @ApiProperty()
  emailSent: string;

  @ApiProperty()
  linkOpen: boolean;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  links: string;

  @ApiProperty()
  linksFull: string;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  attachments: string;

  @ApiProperty()
  textBody: string;

  @ApiProperty()
  textStatus: string;
}
