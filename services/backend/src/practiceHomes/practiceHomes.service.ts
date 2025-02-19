import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity, PracticeHomesEntity } from '@packages/entities';
import logger from 'src/logger';
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

  async getPracticeHomesByPracticeIncludeDeleted(
    practiceId: string,
  ): Promise<PracticeHomesEntity[]> {
    return this.practiceHomesRepository.find({
      where: { practice: { id: practiceId } },
      withDeleted: true,
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
    logger.info(`Deleting practice home with ID: ${id}`);
    await this.practiceHomesRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
    logger.info(`Practice home with ID: ${id} deleted successfully`);
  }

  async create(
    { name }: PracticeHomeCreateDto,
    practiceEntity: PracticeEntity,
  ): Promise<PracticeHomesEntity> {
    logger.info(`Creating new practice home record with name ${name}`);
    const newPracticeHome: PracticeHomesEntity =
      this.practiceHomesRepository.create({
        practice: practiceEntity,
        name,
      });

    const createdPracticeHome =
      await this.practiceHomesRepository.save(newPracticeHome);
    logger.info(
      `New practice home created successfully with ID: ${createdPracticeHome?.id}`,
    );
    return createdPracticeHome;
  }

  async update(
    id: string,
    practiceHomePatchDto: PracticeHomePatchDto,
    practiceId: string,
  ): Promise<PracticeHomesEntity | null> {
    logger.info(`Updating practice home record with ID: ${id}`);
    const practiceHomeToUpdate = await this.getPracticeHomeById(id, practiceId);

    if (!practiceHomeToUpdate) {
      throw new HttpException(`PracticeHome  not found`, HttpStatus.NOT_FOUND);
    }

    await this.practiceHomesRepository.update(id, {
      ...practiceHomePatchDto,
      practice: { id: practiceId },
    });
    logger.info(`Practice home record with ID: ${id} updated successfully`);

    return await this.practiceHomesRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }
}
