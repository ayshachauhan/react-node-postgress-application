import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity, PracticeHomesEntity } from '@packages/entities';
import { Repository } from 'typeorm';
import { PracticeHomeCreateDto } from './dto/create.dto';
import { PracticeHomePatchDto } from './dto/patch.dto';

@Injectable()
export class PracticeHomesService {
  constructor(
    @InjectRepository(PracticeHomesEntity)
    private practiceHomesRepository: Repository<PracticeHomesEntity>,
  ) {}

  async getPracticeHomesByPractice(
    practiceId: string,
  ): Promise<PracticeHomesEntity[]> {
    return this.practiceHomesRepository.find({
      where: { practice: { id: practiceId } },
    });
  }

  async getPracticeHomeById(
    id: string,
    practiceId: string,
  ): Promise<PracticeHomesEntity | null> {
    if (id) {
      return this.practiceHomesRepository.findOne({
        where: { id, practice: { id: practiceId } },
      });
    }
    return null;
  }

  async remove(id: string, practiceId: string): Promise<void> {
    await this.practiceHomesRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
  }

  async create(
    { name }: PracticeHomeCreateDto,
    practiceEntity: PracticeEntity,
  ): Promise<PracticeHomesEntity> {
    const newPracticeHome: PracticeHomesEntity =
      this.practiceHomesRepository.create({
        practice: practiceEntity,
        name,
      });

    return await this.practiceHomesRepository.save(newPracticeHome);
  }

  async update(
    id: string,
    practiceHomePatchDto: PracticeHomePatchDto,
    practiceId: string,
  ): Promise<PracticeHomesEntity | null> {
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
