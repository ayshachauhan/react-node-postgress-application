import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity, WaitlistEntity } from '@packages/entities';
import { Repository } from 'typeorm';
import { WaitlistCreateDto } from './dto/create.dto';
import { WaitlistPatchDto } from './dto/patch.dto';

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(WaitlistEntity)
    private waitlistRepository: Repository<WaitlistEntity>,
  ) {}

  async getWaitlistByPractice(practiceId: string): Promise<WaitlistEntity[]> {
    return this.waitlistRepository.find({
      where: { practice: { id: practiceId } },
    });
  }

  async getWaitlistById(
    id: string,
    practiceId: string,
  ): Promise<WaitlistEntity | null> {
    return this.waitlistRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }

  async removeWaitlist(id: string, practiceId: string): Promise<void> {
    await this.waitlistRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
  }

  async createWaitlist(
    { name }: WaitlistCreateDto,
    practiceEntity: PracticeEntity,
  ): Promise<WaitlistEntity> {
    const newPracticeHome: WaitlistEntity = this.waitlistRepository.create({
      practice: practiceEntity,
      name,
    });

    return await this.waitlistRepository.save(newPracticeHome);
  }

  async updateWaitlist(
    id: string,
    waitlistPatchDto: WaitlistPatchDto,
    practiceId: string,
  ): Promise<WaitlistEntity | null> {
    const practiceHomeToUpdate = await this.getWaitlistById(id, practiceId);

    if (!practiceHomeToUpdate) {
      throw new HttpException(`Waitlist  not found`, HttpStatus.NOT_FOUND);
    }

    await this.waitlistRepository.update(id, {
      ...waitlistPatchDto,
      practice: { id: practiceId },
    });

    return await this.waitlistRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }
}
