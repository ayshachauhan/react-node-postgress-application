import { IReferrer } from '@packages/entities/referrer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ReferrerType } from '../referrer/referrrer.interface';

@Entity('referrers')
export class ReferrersEntity extends BaseEntity implements IReferrer {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'enum', enum: ReferrerType })
  referrerType: ReferrerType;
}
