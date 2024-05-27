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
    @Param() { practiceId, userId }: { practiceId: string; userId: string },
  ): Promise<TemplateEntity[]> {
    return this.templateService.findAll(practiceId, userId);
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
  @UseGuards(PermissionGuard(USER_PERMISSIONS.EDIT_CASE))
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
  async remove(@Param('id') id: string): Promise<void> {
    return await this.templateService.remove(id);
  }
}
