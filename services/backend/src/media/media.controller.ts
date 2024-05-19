import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  Permission,
  UserPermissionsGuard,
} from 'src/auth/userPermissions.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { CreateVideoDto } from './dtos/createVideo.dto';
import { UpdateVideoDto } from './dtos/update.video.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/videos')
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  @UseGuards(UserPermissionsGuard)
  @Permission('view_videos')
  @UseInterceptors(practiceNotFoundInterceptor)
  getVideosByPractice(@Param('practiceId') practiceId: string) {
    return this.mediaService.getVideosByPracticeId(practiceId);
  }

  @Get(':id')
  @UseGuards(UserPermissionsGuard)
  @Permission('view_videos')
  @UseInterceptors(practiceNotFoundInterceptor)
  getVideoById(@Param() params: { practiceId: string; id: string }) {
    const { practiceId, id } = params;
    return this.mediaService.getVideosById(practiceId, id);
  }

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  createVideo(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) videoData: CreateVideoDto,
  ) {
    return this.mediaService.createVideo(practiceId, videoData);
  }

  @Delete(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  deleteVideoById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ) {
    return this.mediaService.deleteVideo(practiceId, id);
  }

  @Patch(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  updateVideoByPracticeId(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
    @Body(new ValidationPipe()) videoData: UpdateVideoDto,
  ) {
    return this.mediaService.updateVideo(practiceId, id, videoData);
  }
}
