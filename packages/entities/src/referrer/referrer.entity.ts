import { Column, Entity, OneToMany } from 'typeorm';
import { IReferrer } from '.';
import { BaseEntity } from '../base.entity';
import { EvalEntity, IEval } from '../eval';
import { ISurgery, SurgeryEntity } from '../surgery';
import { ReferrerType } from './referrer.interface';

@Entity('referrers')
export class ReferrersEntity extends BaseEntity implements IReferrer {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'enum', enum: ReferrerType })
  referrerType: ReferrerType;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToMany(() => SurgeryEntity, (s) => s.referrer)
  surgeries: ISurgery[];

  @OneToMany(() => EvalEntity, (e) => e.referrer)
  evals: IEval[];

  @OneToMany(() => SurgeryEntity, (surgery) => surgery.pcp)
  pcpSurgeries: ISurgery[];

  @OneToMany(() => EvalEntity, (e) => e.pcp)
  pcpEvals: IEval[];
}
