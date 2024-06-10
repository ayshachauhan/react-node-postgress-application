import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { MediaConfigEntity } from '../mediaConfig/mediaConfig.entity';
import { IMedia, MediaType } from './media.interface';

@Entity('media')
export class MediaEntity extends BaseEntity implements IMedia {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  mediaType: MediaType;

  @OneToMany(() => MediaConfigEntity, (mediaConfig) => mediaConfig.media)
  mediaConfigs: MediaConfigEntity[];

  @Column({ type: 'uuid', nullable: true })
  entityId: string;
}
