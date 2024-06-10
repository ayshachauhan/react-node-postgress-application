import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaConfigEntity, MediaConfigType } from '@packages/entities';
import { MediaEntity, MediaType } from '@packages/entities/media';
import { UploadType } from 'src/users/types';
import { getUploadFileKey } from 'src/users/utils';
import { Repository } from 'typeorm';
import { S3Service } from '../users/s3.service';
import { CreateMediaDto } from './dtos/createMedia.dto';
import { MediaConfigDTO, UploadPatientImagesData } from './types';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    @InjectRepository(MediaConfigEntity)
    private readonly mediaConfigRepo: Repository<MediaConfigEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async getVideosByPracticeId(practiceId: string) {
    return await this.media.find({
      where: { practiceId },
      relations: ['mediaConfigs'],
    });
  }

  async getMediaById(
    practiceId: string,
    mediaId: string,
  ): Promise<MediaEntity> {
    const media = await this.media.findOne({
      where: { id: mediaId, practiceId },
      relations: ['mediaConfigs'],
    });

    if (!media) {
      throw new NotFoundException(
        'Media not exists for the provided patient Id.',
      );
    }

    return media;
  }

  /**
   * @param patientId
   * @returns media for specific patient id
   */
  async getMediaByPatientId(patientId: string): Promise<MediaEntity | null> {
    const media = await this.media.findOne({
      where: { entityId: patientId },
    });

    return media;
  }

  /**
   * @param practiceId
   * @param data
   * @returns
   */
  async createOne(
    practiceId: string,
    data: CreateMediaDto,
  ): Promise<MediaEntity | null> {
    // const mediaConfig: MediaConfig = await this.getMediaConfig(data);

    const existingMedia =
      data.mediaType === MediaType.PATIENT
        ? await this.getMediaByPatientId(data.entityId!)
        : null;

    if (existingMedia) {
      return await this.createMediaConfig(existingMedia.id, data.mediaConfig);
    } else {
      const media = this.media.create({
        practiceId,
        mediaType: data.mediaType,
        ...(data.entityId ? { entityId: data.entityId } : {}),
      });
      const newMedia = await this.media.save(media);

      return await this.createMediaConfig(newMedia.id, data.mediaConfig);
    }
  }

  async createMediaConfig(
    mediaId: string,
    mediaConfig: MediaConfigDTO[],
  ): Promise<MediaEntity | null> {
    if (mediaConfig.length) {
      const mediaConfigEntities: MediaConfigEntity[] = mediaConfig.map(
        (config: MediaConfigDTO) =>
          this.mediaConfigRepo.create({
            mediaId,
            configType: config.configType,
            title: config.title,
            url: config.url,
          }),
      );
      await this.mediaConfigRepo.save(mediaConfigEntities);
    }
    return await this.media.findOne({
      where: {
        id: mediaId,
      },
      relations: ['mediaConfigs'],
    });
  }

  async updateMedia(
    practiceId: string,
    mediaId: string,
    videoData: Partial<MediaEntity>,
  ): Promise<MediaEntity | undefined> {
    const media = await this.getMediaById(practiceId, mediaId);

    if (!media) {
      throw new HttpException(
        `Media with id ${mediaId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedVideo = this.media.merge(media, videoData);
    return this.media.save(updatedVideo);
  }

  async deleteVideo(practiceId: string, videoId: string): Promise<void> {
    await this.media.softDelete({ id: videoId, practiceId });
  }

  async uploadUserImg({ id, practiceId, files }: UploadPatientImagesData) {
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const key: string = getUploadFileKey(UploadType.PRACTICE, {
          practiceId,
          file,
        });

        const uploadResult = await this.s3Service.uploadFile(file, key);

        return {
          title: file.originalname.replace(/_/g, ' '),
          url: uploadResult.Location,
          configType: MediaConfigType.IMAGE,
        };
      }),
    );

    const user = await this.createMediaConfig(id, uploadResults);

    return user;
  }
}
