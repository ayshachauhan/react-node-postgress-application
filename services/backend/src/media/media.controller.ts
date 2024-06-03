import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  // Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/auth/userPermissions.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { CreateMediaDto } from './dtos/createMedia.dto';
// import { UpdateVideoDto } from './dtos/update.video.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@ApiTags('Media')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/media')
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_VIDEOS))
  @UseInterceptors(practiceNotFoundInterceptor)
  getVideosByPractice(@Param('practiceId') practiceId: string) {
    return this.mediaService.getVideosByPracticeId(practiceId);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_VIDEOS))
  @UseInterceptors(practiceNotFoundInterceptor)
  getVideoById(@Param() params: { practiceId: string; id: string }) {
    const { practiceId, id } = params;
    return this.mediaService.getVideosById(practiceId, id);
  }

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  createOne(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) data: CreateMediaDto,
  ) {
    console.log('increatemedia', data);

    return this.mediaService.createOne(practiceId, data);
  }

  @Delete(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  deleteVideoById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ) {
    return this.mediaService.deleteVideo(practiceId, id);
  }

  // @Patch(':id')
  // @UseInterceptors(practiceNotFoundInterceptor)
  // updateVideoByPracticeId(
  //   @Param('practiceId') practiceId: string,
  //   @Param('id') id: string,
  //   @Body(new ValidationPipe()) videoData: UpdateVideoDto,
  // ) {
  //   return this.mediaService.updateVideo(practiceId, id, videoData);
  // }

  //   @Patch(':id/upload')
  //   @UseInterceptors(FileInterceptor('file'))
  //   async uploadUserImg(
  //     @Param() params: { id: string; practiceId: string },
  //     @UploadedFile() file: Express.Multer.File,
  //   ) {
  //     return this.mediaService.uploadUserImg({
  //       practiceId: params.practiceId,
  //       id: params.id,
  //       file,
  //     });
  //   }
  // }

  @Patch(':id/upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async uploadUserImg(
    @Param() { id, practiceId }: { id: string; practiceId: string },
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ) {
    return this.mediaService.uploadUserImg({
      id,
      practiceId,
      files: files?.files || [],
    });
  }
}
