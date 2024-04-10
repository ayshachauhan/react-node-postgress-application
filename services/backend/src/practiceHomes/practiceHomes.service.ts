import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeHome } from '../entities/practiceHomes/practiceHomes.entity';
import { PracticesService } from '../practices/practices.service';
import { PracticeHomeCreateDto } from './dto/create.dto';
import { PracticeHomePatchDto } from './dto/patch.dto';

@Injectable()
export class PracticeHomesService {
  constructor(
    @InjectRepository(PracticeHome)
    private practiceHomesRepository: Repository<PracticeHome>,
    private readonly practicesService: PracticesService,
  ) {}

  async getPracticeHomesByPractice(
    practiceId: string,
  ): Promise<PracticeHome[]> {
    return this.practiceHomesRepository.find({
      where: { practice: { id: practiceId } },
    });
  }

  async getPracticeHomeById(
    id: string,
    practiceId: string,
  ): Promise<PracticeHome | null> {
    return this.practiceHomesRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }

  async remove(id: string, practiceId: string): Promise<void> {
    await this.practiceHomesRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
  }

  async create(
    { name }: PracticeHomeCreateDto,
    practiceId: string,
  ): Promise<PracticeHome> {
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
    practiceId: string,
  ): Promise<PracticeHome | null> {
    const practiceHomeToUpdate = await this.getPracticeHomeById(id, practiceId);

    if (!practiceHomeToUpdate) {
      throw new HttpException(`PracticeHome  not found`, HttpStatus.NOT_FOUND);
    }

    await this.practiceHomesRepository.update(id, {
      ...practiceHomePatchDto,
      practice: { id: practiceId },
    });

    return await this.practiceHomesRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }
}
