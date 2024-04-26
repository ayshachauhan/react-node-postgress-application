import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Patient is required' })
  @ApiProperty()
  patientId: string;

  @IsNotEmpty({ message: 'MRN is required' })
  @ApiProperty()
  MRN: string;

  @IsOptional()
  @ApiProperty()
  email: string;

  //@IsNotEmpty({ message: 'Referrer type is required' })
  //@ApiProperty()
  //@IsEnum(ReviewStatus)
  //referrerType: ReferrerType;
}
