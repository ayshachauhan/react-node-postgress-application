import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IReview } from '../review';
import { ReviewStatus } from '../review/review.interface';
import { PracticeEntity } from '../practice';
import { PatientEntity } from '../patient';

@Entity('review')
export class ReviewEntity extends BaseEntity implements IReview {
  @Column({ type: 'enum', enum: ReviewStatus })
  reviewStatus: ReviewStatus;

  @Column({ nullable: true, type: 'timestamp', select: false })
  reviewDate: Date;

  @Column({ type: 'varchar', default: null })
  reviewComment: string;

  @Column({ type: 'varchar', default: null })
  source: string;

  @Column({ type: 'boolean', default: false })
  emailOpened: boolean;

  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;
}
