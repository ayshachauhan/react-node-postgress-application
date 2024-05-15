import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus } from '@packages/entities/review';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class updateReviewDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  practiceId?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  reviewDate?: Date;

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
}
