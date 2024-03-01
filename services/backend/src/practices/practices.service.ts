import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PracticeEntity } from '../entities/practices.entity';
import { PracticePatchDto } from './dto/patch.dto';
import { PracticeCreateDto } from './dto/create.dto';

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>,
  ) {}

  async findAll(): Promise<PracticeEntity[]> {
    return await this.practicesRepository.find();
  }

  async findOne(id: string): Promise<PracticeEntity | null> {
    return await this.practicesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.practicesRepository.softDelete(id);
  }

  async create({ name }: PracticeCreateDto): Promise<PracticeEntity> {
    const newPractice: PracticeEntity = new PracticeEntity();

    return await this.practicesRepository.save({ ...newPractice, name });
  }

  async update(
    id: string,
    practicePatchDto: PracticePatchDto,
  ): Promise<PracticeEntity | null> {
    const updateResult: UpdateResult = await this.practicesRepository.update(
      id,
      practicePatchDto,
    );

    if (updateResult.affected === 0) {
      throw new HttpException(
        `Practice with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.practicesRepository.findOne({ where: { id } });
  }
}
