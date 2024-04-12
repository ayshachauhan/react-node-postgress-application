import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SurgeryTypeEntity } from './surgeryTypes.entity';

@Entity('videos')
export class Video extends BaseEntity {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  urlEmbed: string;

  @Column({ type: 'varchar' })
  url: string;

  @ManyToOne(() => SurgeryTypeEntity)
  @JoinColumn({ name: 'surgeryTypeId' })
  surgeryType: SurgeryTypeEntity;
}
