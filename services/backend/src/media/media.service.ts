import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity } from 'src/entities/practice/practice.entity';
import { Repository } from 'typeorm';
import { Video } from '../entities/media/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Video)
    private readonly videos: Repository<Video>,
    @InjectRepository(PracticeEntity)
    private readonly practice: Repository<PracticeEntity>,
  ) {}

  async getVideosByPracticeId(practiceId: string) {
    return await this.videos.find({ where: { practiceId } });
  }

  async getVideosById(practiceId: string, videoId: string): Promise<Video> {
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
    videoData: Partial<Video>,
  ): Promise<Video> {
    const practice = await this.practice.findOne({ where: { id: practiceId } });
    if (!practice) {
      throw new NotFoundException('Practice not exists');
    }
    const video = this.videos.create({ ...videoData, practiceId });
    return await this.videos.save(video);
  }

  async updateVideo(
    practiceId: string,
    videoId: string,
    videoData: Partial<Video>,
  ): Promise<Video | undefined> {
    const video = await this.getVideosById(practiceId, videoId);
    const updatedVideo = this.videos.merge(video, videoData);
    return this.videos.save(updatedVideo);
  }

  async deleteVideo(practiceId: string, videoId: string): Promise<void> {
    await this.videos.softDelete({ id: videoId, practiceId });
  }
}
