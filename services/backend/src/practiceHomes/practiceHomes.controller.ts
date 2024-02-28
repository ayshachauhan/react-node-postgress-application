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

@Controller('practiceHomes')
export class PracticeHomesController {
  constructor(private readonly practiceHomesService: PracticeHomesService) {}

  @Get()
  async findAll(): Promise<PracticeEntity[]> {
    return this.practiceHomesService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: any): Promise<PracticeEntity | null> {
    return this.practiceHomesService.findOne(params.id);
  }

  @Delete(':id')
  async remove(@Param() params: any): Promise<string> {
    return this.practiceHomesService.remove(params.id);
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) practiceHomeCreateto: PracticeHomeCreateDto,
  ): Promise<String> {
    return this.practiceHomesService.create(practiceHomeCreateto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() practiceHomePatchDto: PracticeHomePatchDto,
  ): Promise<String> {
    return this.practiceHomesService.update(id, practiceHomePatchDto);
  }
}
