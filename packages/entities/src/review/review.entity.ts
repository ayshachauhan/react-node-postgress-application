import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IReview } from '../review';
import { ReviewStatus } from '../review/review.interface';

@Entity('review')
export class Review extends BaseEntity implements IReview {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar' })
  patientId: string;

  @Column({ type: 'varchar' })
  MRN: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'enum', enum: ReviewStatus })
  reviewStatus: ReviewStatus;

  @Column({ nullable: true, type: 'timestamp', select: false })
  reviewDate: Date;

  @Column({ type: 'varchar' })
  reviewComment: string;
}
