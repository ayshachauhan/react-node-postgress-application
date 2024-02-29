import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { PracticeHomesService } from './practiceHomes.service';
import { PracticeEntity } from '../entities/practices.entity';
import { PracticeHomePatchDto } from './dto/patch.dto';
import { PracticeHomeCreateDto } from './dto/create.dto';
import { PracticeHome } from 'src/entities/practiceHomes.entity';

@Controller('practice-homes')
export class PracticeHomesController {
  constructor(private readonly practiceHomesService: PracticeHomesService) {}

  @Get()
  async findAll(): Promise<PracticeEntity[]> {
    return this.practiceHomesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PracticeEntity | null> {
    return this.practiceHomesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.practiceHomesService.remove(id);
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) practiceHomeCreateto: PracticeHomeCreateDto,
  ): Promise<PracticeHome> {
    return this.practiceHomesService.create(practiceHomeCreateto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() practiceHomePatchDto: PracticeHomePatchDto,
  ): Promise<PracticeHome | null> {
    return this.practiceHomesService.update(id, practiceHomePatchDto);
  }
}
