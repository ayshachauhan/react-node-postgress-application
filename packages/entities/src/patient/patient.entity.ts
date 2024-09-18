import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { EvalEntity } from '../eval';
import { PracticeEntity } from '../practice';
import { SurgeryEntity } from '../surgery';

@Entity('patients')
export class PatientEntity extends BaseEntity {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'integer' })
  mrn: number;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  countryCode: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @OneToMany(() => SurgeryEntity, (surgery) => surgery.patient)
  surgeries: SurgeryEntity[];

  @OneToMany(() => EvalEntity, (evalModule) => evalModule.patient)
  evals: EvalEntity[];
}
