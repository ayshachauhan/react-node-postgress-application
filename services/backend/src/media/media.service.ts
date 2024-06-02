import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MediaConfig,
  MediaType,
  PatientMediaConfig,
  PracticeMediaConfig,
  VideoEntity,
} from '@packages/entities/media';
import { SurgeryConfigurationEntity } from '@packages/entities/surgeryConfiguration';
import { UploadType, UploadUserImgData } from 'src/users/types';
import { getUploadFileKey } from 'src/users/utils';
import { Repository } from 'typeorm';
import { S3Service } from '../users/s3.service';
import { CreateMediaDto } from './dtos/createMedia.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videos: Repository<VideoEntity>,
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
    return await this.videos.find({
      where: { practiceId },
      relations: ['surgeryConfiguration'],
    });
  }

  async getVideosById(
    practiceId: string,
    videoId: string,
  ): Promise<VideoEntity> {
    const video = await this.videos.findOne({
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
  ): Promise<VideoEntity> {
    const mediaConfig: MediaConfig = await this.getMediaConfig(data);

    const video = this.videos.create({
      practiceId,
      mediaType: data.mediaType,
      mediaConfig,
    });

    return await this.videos.save(video);
  }

  async updateVideo(
    practiceId: string,
    videoId: string,
    videoData: Partial<VideoEntity>,
  ): Promise<VideoEntity | undefined> {
    const video = await this.getVideosById(practiceId, videoId);
    const updatedVideo = this.videos.merge(video, videoData);
    return this.videos.save(updatedVideo);
  }

  async deleteVideo(practiceId: string, videoId: string): Promise<void> {
    await this.videos.softDelete({ id: videoId, practiceId });
  }

  async uploadUserImg({ id, practiceId, file }: UploadUserImgData) {
    const key: string = getUploadFileKey(UploadType.USER, {
      practiceId,
      userId: id,
      file,
    });

    const uploadImg = await this.s3Service.uploadFile(file, key);

    //@ts-expect-error only need to send url from here
    return this.updateUser(id, { imgUrl: uploadImg.Location });
  }
}
