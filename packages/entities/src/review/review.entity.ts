import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IReview } from '../review';
import { ReviewStatus } from '../review/review.interface';

@Entity('review')
export class ReviewEntity extends BaseEntity implements IReview {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar' })
  patientId: string;

  @Column({ type: 'enum', enum: ReviewStatus })
  reviewStatus: ReviewStatus;

  @Column({ nullable: true, type: 'timestamp', select: false })
  reviewDate: Date;

  @Column({ type: 'varchar', default: null })
  reviewComment: string;
}
