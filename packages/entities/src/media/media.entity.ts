import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IMedia, MediaConfig, MediaType } from './media.interface';

@Entity('media')
export class MediaEntity extends BaseEntity implements IMedia {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  mediaType: MediaType;

  @Column({ type: 'jsonb' })
  mediaConfig: MediaConfig;
}
