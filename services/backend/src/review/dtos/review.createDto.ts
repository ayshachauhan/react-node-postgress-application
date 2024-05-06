import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus } from '@packages/entities/review';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Patient is required' })
  @ApiProperty()
  patientId: string;

  @IsNotEmpty({ message: 'MRN is required' })
  @ApiProperty()
  MRN: string;

  @IsNotEmpty({ message: 'Patient email is required' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Status is required' })
  @ApiProperty()
  @IsEnum(ReviewStatus)
  reviewStatus: ReviewStatus;

  @IsOptional()
  @ApiProperty()
  reviewComment: string;

  @IsOptional()
  @ApiProperty()
  reviewDate: Date;

  @IsOptional()
  @ApiProperty()
  source: string;
}
