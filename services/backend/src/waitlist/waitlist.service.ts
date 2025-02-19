import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity, WaitlistEntity } from '@packages/entities';
import logger from 'src/logger';
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
    if (id) {
      return this.waitlistRepository.findOne({
        where: { id, practice: { id: practiceId } },
      });
    } else return null;
  }

  async removeWaitlist(id: string, practiceId: string): Promise<void> {
    logger.info(`Deleting waitlist with ID ${id}`);
    await this.waitlistRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
    logger.info(`Waitlist with ID ${id} deleted successfully`);
  }

  async createWaitlist(
    { name }: WaitlistCreateDto,
    practiceEntity: PracticeEntity,
  ): Promise<WaitlistEntity> {
    logger.info(`Creating new waitlist with name ${name}`);
    const newPracticeHome: WaitlistEntity = this.waitlistRepository.create({
      practice: practiceEntity,
      name,
    });

    const savedWaitlist = await this.waitlistRepository.save(newPracticeHome);
    logger.info(
      `New waitlist created successfully with ID ${savedWaitlist?.id}`,
    );
    return savedWaitlist;
  }

  async updateWaitlist(
    id: string,
    waitlistPatchDto: WaitlistPatchDto,
    practiceId: string,
  ): Promise<WaitlistEntity | null> {
    logger.info(`Updating waitlist with ID ${id}`);
    const practiceHomeToUpdate = await this.getWaitlistById(id, practiceId);

    if (!practiceHomeToUpdate) {
      throw new HttpException(`Waitlist  not found`, HttpStatus.NOT_FOUND);
    }

    await this.waitlistRepository.update(id, {
      ...waitlistPatchDto,
      practice: { id: practiceId },
    });
    logger.info(`Waitlist with ID ${id} updated successfully`);

    return await this.waitlistRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }
}
