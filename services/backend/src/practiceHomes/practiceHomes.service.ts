import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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

  async remove(id: string): Promise<void> {
    await this.practiceHomesRepository.softDelete(id);
  }

  async create({
    name,
    practiceId,
  }: PracticeHomeCreateDto): Promise<PracticeHome> {
    const newPracticeHome: PracticeHome = new PracticeHome();

    const practiceEntity = await this.practicesService.findOne(practiceId);
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }

    return await this.practiceHomesRepository.save({
      ...newPracticeHome,
      practice: practiceEntity,
      name,
    });
  }

  async update(
    id: string,
    practiceHomePatchDto: PracticeHomePatchDto,
  ): Promise<PracticeHome | null> {
    const updateResult: UpdateResult =
      await this.practiceHomesRepository.update(id, practiceHomePatchDto);

    if (updateResult.affected === 0) {
      throw new HttpException(
        `PracticeHome with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.practiceHomesRepository.findOne({ where: { id } });
  }
}
