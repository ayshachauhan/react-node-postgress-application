import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { TemplateEntity } from '@packages/entities/template';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/auth/userPermissions.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticeGuard } from 'src/practices/practice.guard';
import { TemplateCreateDto } from './dto/template.createDto';
import { TemplatePatchDto } from './dto/template.patchDto';
import { TemplatesService } from './templates.service';

@ApiTags('Templates')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/users/:userId/templates')
@UseGuards(AuthGuard, PracticeGuard)
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}

  @Get()
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_TEMPLATES))
  @UseInterceptors(practiceNotFoundInterceptor)
  async findAll(
    @Param() { practiceId }: { practiceId: string; userId: string },
  ): Promise<TemplateEntity[]> {
    return this.templateService.findAll(practiceId);
  }

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  async create(
    @Body(new ValidationPipe()) templateCreateDto: TemplateCreateDto,
    @Param() { practiceId, userId }: { practiceId: string; userId: string },
  ): Promise<TemplateEntity> {
    return this.templateService.create({
      templateCreateDto,
      practiceId,
      surgeonId: userId,
    });
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.EDIT_TEMPLATES))
  @UseInterceptors(practiceNotFoundInterceptor)
  async update(
    @Body(new ValidationPipe()) templatePatchDto: TemplatePatchDto,
    @Param()
    {
      practiceId,
      userId,
      id,
    }: { practiceId: string; userId: string; id: string },
  ): Promise<TemplateEntity | null> {
    return this.templateService.update({
      templatePatchDto,
      practiceId,
      surgeonId: userId,
      id,
    });
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.DELETE_TEMPLATE))
  async remove(@Param('id') id: string): Promise<void> {
    return await this.templateService.remove(id);
  }

  @Patch(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImg(
    @Param() params: { id: string; practiceId: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { mimetype, size } = file;

    const allowedTemplateTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'video/mp4',
    ];

    const maxTempFileSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTemplateTypes.includes(mimetype)) {
      throw new BadRequestException(`Unsupported file type: ${mimetype}`);
    }

    if (size > maxTempFileSizeInBytes) {
      throw new BadRequestException(`File size exceeds the limit of 5 MB.`);
    }

    const validTemplateSignatures = {
      jpg: [0xff, 0xd8, 0xff],
      png: [0x89, 0x50, 0x4e, 0x47],
      pdf: [0x25, 0x50, 0x44, 0x46],
      doc: [0xd0, 0xcf, 0x11, 0xe0],
      docx: [0x50, 0x4b, 0x03, 0x04],
      mp4: [0x00, 0x00, 0x00, 0x18],
    };

    const buffer = file.buffer;
    const byteArray = new Uint8Array(buffer);
    const matched = Object.values(validTemplateSignatures).some((sig) => {
      const slice = byteArray.slice(0, sig.length);
      return slice.join() === sig.join();
    });

    if (!matched && mimetype !== 'text/plain') {
      throw new BadRequestException(
        'File signature does not match known types',
      );
    }
    return this.templateService.uploadTemplateAttachment({
      practiceId: params.practiceId,
      id: params.id,
      file,
    });
  }
}
