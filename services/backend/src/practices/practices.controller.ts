import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { PracticesService } from './practices.service';
import { PracticeEntity } from '../entities/practices.entity';
import { PracticePatchDto } from './dto/patch.dto';
import { PracticeCreateDto } from './dto/create.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('practices')
@UseGuards(AuthGuard)
export class PracticesController {
  constructor(private readonly practiceService: PracticesService) {}

  @Get()
  async findAll(): Promise<PracticeEntity[]> {
    return this.practiceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PracticeEntity | null> {
    return this.practiceService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.practiceService.remove(id);
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) practiceCreateDto: PracticeCreateDto,
  ): Promise<PracticeEntity> {
    return this.practiceService.create(practiceCreateDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() practicePatchDto: PracticePatchDto,
  ): Promise<PracticeEntity | null> {
    return this.practiceService.update(id, practicePatchDto);
  }
}
