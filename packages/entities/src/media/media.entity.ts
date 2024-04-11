import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IMedia } from './media.interface';

@Entity('videos')
export class Video extends BaseEntity implements IMedia {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  urlEmbed: string;

  @Column({ type: 'varchar' })
  url: string;
}
