import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IMedia } from '@packages/entities';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/auth/userPermissions.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticeGuard } from 'src/practices/practice.guard';
import { CreateMediaDto, SendVideoDto } from './dtos/createMedia.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/media')
@UseInterceptors(practiceNotFoundInterceptor)
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get()
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_VIDEOS), PracticeGuard)
  getVideosByPractice(@Param('practiceId') practiceId: string) {
    return this.mediaService.getMediaByPracticeId(practiceId);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_VIDEOS), PracticeGuard)
  getVideoById(@Param() params: { practiceId: string; id: string }) {
    const { practiceId, id } = params;
    return this.mediaService.getMediaById(practiceId, id);
  }

  @Post()
  @UseGuards(PracticeGuard)
  createOne(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) data: CreateMediaDto,
  ) {
    return this.mediaService.createOne(practiceId, data);
  }

  @Delete(':id')
  @UseGuards(PracticeGuard)
  deleteMediaById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ) {
    return this.mediaService.deleteMedia(practiceId, id);
  }

  @Delete('mediaconfig/:id')
  @UseGuards(PracticeGuard)
  deleteMediaConfigById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ): Promise<IMedia[]> {
    return this.mediaService.deleteMediaConfigById(practiceId, id);
  }

  @Patch(':id/upload')
  @UseGuards(PracticeGuard)
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

  @Post('send-video-to-patient')
  @UseGuards(PracticeGuard)
  sendVideo(
    @Req() request: Request,
    @Body(new ValidationPipe()) data: SendVideoDto,
  ) {
    const practiceEntity = request['practiceEntity'];
    return this.mediaService.sendVideoToPatient(practiceEntity, data);
  }
}
