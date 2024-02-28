import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.practicesRepository.find();
  }

  async findOne(id: string): Promise<PracticeEntity | null> {
    return this.practicesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<string> {
    await this.practicesRepository.softDelete(id);
    return 'Practice deleted successfully';
  }

  async create(practiceCreateDto: PracticeCreateDto): Promise<string> {
    const newPractice: PracticeEntity = new PracticeEntity();
    newPractice.name = practiceCreateDto.name;

    await this.practicesRepository.save(newPractice);

    return 'Practice created';
  }

  async update(
    id: string,
    practicePatchDto: PracticePatchDto,
  ): Promise<string> {
    await this.practicesRepository.update(id, practicePatchDto);
    return 'Practice updated';
  }
}
