import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IMedia, MediaConfig, MediaType } from './media.interface';

@Entity('videos')
export class VideoEntity extends BaseEntity implements IMedia {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    nullable: true,
  })
  mediaType: MediaType;

  @Column({ type: 'jsonb' })
  mediaConfig: MediaConfig;
}
