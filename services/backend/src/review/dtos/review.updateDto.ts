import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus } from '@packages/entities/review';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class updateReviewDto {
  @IsNotEmpty()
  @ApiProperty()
  id?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  practiceId?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  reviewRequestDate?: Date;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  reviewPostDate?: Date;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  reviewComment?: string;

  @IsOptional()
  @ApiProperty()
  patientId?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(ReviewStatus)
  reviewStatus?: ReviewStatus;

  @IsOptional()
  @ApiProperty()
  surgeryId?: string;
}
