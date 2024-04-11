import { SurgeryType } from 'src/enums/surgeryType.enum';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

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

  @Column({ type: 'enum', enum: SurgeryType, default: SurgeryType.CATARACT })
  surgeryType: SurgeryType;
}
