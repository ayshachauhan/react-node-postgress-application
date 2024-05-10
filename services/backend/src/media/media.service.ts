import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from '@packages/entities/media';
import { SurgeryTypeEntity } from '@packages/entities/surgeryType';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videos: Repository<VideoEntity>,
    @InjectRepository(SurgeryTypeEntity)
    private readonly surgeryType: Repository<SurgeryTypeEntity>,
  ) {}

  async getVideosByPracticeId(practiceId: string) {
    return await this.videos.find({
      where: { practiceId },
      relations: ['surgeryType'],
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

  async createVideo(
    practiceId: string,
    videoData: { surgeryTypeId: string } & Partial<VideoEntity>,
  ): Promise<VideoEntity> {
    const surgeryType = await this.surgeryType.findOne({
      where: { id: videoData.surgeryTypeId },
    });
    if (!surgeryType) {
      throw new NotFoundException('Surgery type not found');
    }
    const video = this.videos.create({ ...videoData, practiceId, surgeryType });
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
}
