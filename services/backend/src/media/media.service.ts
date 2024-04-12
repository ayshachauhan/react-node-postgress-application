import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '@packages/entities/media';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Video)
    private readonly videos: Repository<Video>,
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
