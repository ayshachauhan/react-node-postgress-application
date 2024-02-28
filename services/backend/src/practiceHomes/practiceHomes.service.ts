import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeHome } from '../entities/practiceHomes.entity';
import { PracticesService } from '../practices/practices.service';
import { PracticeHomePatchDto } from './dto/patch.dto';
import { PracticeHomeCreateDto } from './dto/create.dto';

@Injectable()
export class PracticeHomesService {
  constructor(
    @InjectRepository(PracticeHome)
    private practiceHomesRepository: Repository<PracticeHome>,
    private readonly practicesService: PracticesService,
  ) {}

  async findAll(): Promise<PracticeHome[]> {
    return this.practiceHomesRepository.find();
  }

  async findOne(id: string): Promise<PracticeHome | null> {
    return this.practiceHomesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<string> {
    await this.practiceHomesRepository.softDelete(id);
    return 'Practice deleted successfully';
  }

  async create(practiceHomeCreateDto: PracticeHomeCreateDto): Promise<string> {
    const newPracticeHome: PracticeHome = new PracticeHome();
    newPracticeHome.name = practiceHomeCreateDto.name;

    const practiceEntity = await this.practicesService.findOne(
      practiceHomeCreateDto.practiceId,
    );

    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }

    newPracticeHome.practice = practiceEntity;

    await this.practiceHomesRepository.save(newPracticeHome);

    return 'Practice Homes created';
  }

  async update(
    id: string,
    practiceHomePatchDto: PracticeHomePatchDto,
  ): Promise<string> {
    await this.practiceHomesRepository.update(id, practiceHomePatchDto);
    return 'Practice Home updated';
  }
}
