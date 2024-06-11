import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { MediaEntity } from '../media/media.entity';
import { IMediaConfig, MediaConfigType } from './mediaConfig.interface';

@Entity('mediaconfig')
export class MediaConfigEntity extends BaseEntity implements IMediaConfig {
  @Column({ type: 'uuid' })
  mediaId: string;

  @Column({
    type: 'enum',
    enum: MediaConfigType,
  })
  configType: MediaConfigType;

  @Column()
  title: string;

  @Column()
  url: string;

  @ManyToOne(() => MediaEntity, (media) => media.mediaConfigs)
  media: MediaEntity;
}
