import { PracticeStatus } from 'src/enums/status.enum';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('practices')
export class PracticeEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({
    type: 'enum',
    enum: PracticeStatus,
    default: PracticeStatus.ACTIVE,
  })
  status: PracticeStatus;

  @Column({ type: 'varchar' })
  photoUrl: string;
}
