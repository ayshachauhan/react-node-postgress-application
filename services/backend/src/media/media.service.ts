import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MediaConfig,
  MediaEntity,
  MediaType,
  PatientMediaConfig,
  PracticeMediaConfig,
} from '@packages/entities/media';
import { SurgeryConfigurationEntity } from '@packages/entities/surgeryConfiguration';
import { UploadType } from 'src/users/types';
import { getUploadFileKey } from 'src/users/utils';
import { Repository } from 'typeorm';
import { S3Service } from '../users/s3.service';
import { CreateMediaDto } from './dtos/createMedia.dto';
import { UploadPatientImagesData } from './types';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    @InjectRepository(SurgeryConfigurationEntity)
    private readonly surgeryConfiguration: Repository<SurgeryConfigurationEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async getMediaConfig(data: CreateMediaDto): Promise<MediaConfig> {
    switch (data.mediaType) {
      case MediaType.PRACTICE: {
        const config = data.mediaConfig as PracticeMediaConfig;

        const surgeryConfiguration = await this.surgeryConfiguration.findOne({
          where: {
            id: config.surgeryConfigurationId,
          },
        });

        if (!surgeryConfiguration) {
          throw new NotFoundException('Surgery type not found');
        }

        return {
          surgeryConfigurationId: config.surgeryConfigurationId,
          video: config.video,
        };
      }
      case MediaType.PATIENT: {
        const config = data.mediaConfig as PatientMediaConfig;

        return {
          patientId: config.patientId,
          video: config.video,
          image: [],
        };
      }
    }
  }

  async getVideosByPracticeId(practiceId: string) {
    return await this.media.find({
      where: { practiceId },
    });
  }

  async getVideosById(
    practiceId: string,
    videoId: string,
  ): Promise<MediaEntity> {
    const video = await this.media.findOne({
      where: { id: videoId, practiceId },
    });
    if (!video) {
      throw new NotFoundException('Video not exists');
    }
    return video;
  }

  /**
   * @param practiceId
   * @param data
   * @returns
   */
  async createOne(
    practiceId: string,
    data: CreateMediaDto,
  ): Promise<MediaEntity> {
    const mediaConfig: MediaConfig = await this.getMediaConfig(data);

    console.log(mediaConfig, 'mediaconfig');

    const media = this.media.create({
      practiceId,
      mediaType: data.mediaType,
      mediaConfig,
    });

    console.log(media, 'mediacreated');

    return await this.media.save(media);
  }

  async updateVideo(
    practiceId: string,
    videoId: string,
    videoData: Partial<MediaEntity>,
  ): Promise<MediaEntity | undefined> {
    const video = await this.getVideosById(practiceId, videoId);
    const updatedVideo = this.media.merge(video, videoData);
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
        return uploadResult.Location;
      }),
    );

    //ToDO - get the user and make map here for images and then call update

    //@ts-expect-error only need to send url from here
    return this.updateUser(id, { imgUrl: uploadResults });
  }
}
