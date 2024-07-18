import {
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
import { TemplateCreateDto } from './dto/template.createDto';
import { TemplatePatchDto } from './dto/template.patchDto';
import { TemplatesService } from './templates.service';

@ApiTags('Templates')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/users/:userId/templates')
@UseGuards(AuthGuard)
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
    return this.templateService.uploadTemplateAttachment({
      practiceId: params.practiceId,
      id: params.id,
      file,
    });
  }
}
