import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PatientEntity } from '../patient';
import { PracticeEntity } from '../practice';
import { IReview } from '../review';
import { ReviewStatus } from '../review/review.interface';

@Entity('review')
export class ReviewEntity extends BaseEntity implements IReview {
  @Column({ type: 'enum', enum: ReviewStatus })
  reviewStatus: ReviewStatus;

  @Column({ nullable: true, type: 'timestamp' })
  reviewRequestDate: Date;

  @Column({ nullable: true, type: 'timestamp' })
  reviewPostDate: Date;

  @Column({ type: 'varchar', default: null })
  userRating: string;

  @Column({ type: 'varchar', default: null })
  reviewComment: string;

  @Column({ type: 'varchar', default: null })
  source: string;

  @Column({ type: 'boolean', default: false })
  emailOpened: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  practiceResponseDate: Date;

  @Column({ type: 'varchar', default: null })
  practiceResponse: string;

  @Column({ type: 'varchar', default: null })
  tags: string;

  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;
}
