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
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PracticeEntity } from '@packages/entities/practice';
import { AuthGuard } from '../auth/auth.guard';
import { SuperAdminGuard } from '../auth/superAdmin.guard';
import { PracticeCreateDto } from './dto/create.dto';
import { PracticePatchDto } from './dto/patch.dto';
import { PracticesService } from './practices.service';
import { PracticesGetInterface } from './types';

@ApiTags('Practcies')
@Controller('practices')
export class PracticesController {
  constructor(private readonly practiceService: PracticesService) {}

  @Get()
  @ApiBearerAuth('superadmin')
  @UseGuards(SuperAdminGuard)
  async findAll(): Promise<PracticesGetInterface[]> {
    return this.practiceService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('normal')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<PracticeEntity | null> {
    return this.practiceService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth('superadmin')
  @UseGuards(SuperAdminGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.practiceService.remove(id);
  }

  @Post()
  @ApiBearerAuth('superadmin')
  @UseGuards(SuperAdminGuard)
  async create(
    @Body(new ValidationPipe()) practiceCreateDto: PracticeCreateDto,
  ): Promise<PracticeEntity> {
    return this.practiceService.create(practiceCreateDto);
  }

  @Patch(':id')
  @ApiBearerAuth('superadmin')
  @UseGuards(SuperAdminGuard)
  async update(
    @Param('id') id: string,
    @Body() practicePatchDto: PracticePatchDto,
  ): Promise<PracticeEntity | null> {
    return this.practiceService.update(id, practicePatchDto);
  }

  @Patch(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImg(
    @Param() params: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.practiceService.uploadPracticeImg({
      practiceId: params.id,
      file,
    });
  }
}
