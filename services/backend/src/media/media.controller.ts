import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateVideoDto } from './dtos/createVideo.dto';
import { UpdateVideoDto } from './dtos/update.video.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('/practices/:practiceId/videos')
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  getVideosByPractice(@Param('practiceId') practiceId: string) {
    return this.mediaService.getVideosByPracticeId(practiceId);
  }

  @Get(':id')
  getVideoById(@Param() params: { practiceId: string; id: string }) {
    const { practiceId, id } = params;
    return this.mediaService.getVideosById(practiceId, id);
  }

  @Post()
  createVideo(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) videoData: CreateVideoDto,
  ) {
    return this.mediaService.createVideo(practiceId, videoData);
  }

  @Delete(':id')
  deleteVideoById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ) {
    return this.mediaService.deleteVideo(practiceId, id);
  }

  @Patch(':id')
  updateVideoByPracticeId(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
    @Body(new ValidationPipe()) videoData: UpdateVideoDto,
  ) {
    return this.mediaService.updateVideo(practiceId, id, videoData);
  }
}
