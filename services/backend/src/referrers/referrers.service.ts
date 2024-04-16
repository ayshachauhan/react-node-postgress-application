import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeEntity } from '../entities/practices.entity';
import { Referrers } from '../entities/referrers.entity';
@Injectable()
export class ReferrersService {
  constructor(
    @InjectRepository(Referrers)
    private readonly referrers: Repository<Referrers>,
    @InjectRepository(PracticeEntity)
    private readonly practice: Repository<PracticeEntity>,
  ) {}
  async createReferrer(
    practiceId: string,
    referrerData: Partial<Referrers>,
  ): Promise<Referrers> {
    const practice = await this.practice.findOne({ where: { id: practiceId } });
    if (!practice) {
      throw new NotFoundException('Practice not exists');
    }
    const video = this.referrers.create({ ...referrerData, practiceId });
    return await this.referrers.save(video);
  }
  async deleteReferrer(practiceId: string, id: string): Promise<void> {
    await this.referrers.softDelete({
      id,
      practiceId,
    });
  }

  private async getReferrerById(
    practiceId: string,
    referrerId: string,
  ): Promise<Referrers> {
    const referrer = await this.referrers.findOne({
      where: { id: referrerId, practiceId },
    });
    if (!referrer) {
      throw new NotFoundException('Referrer not exists');
    }
    return referrer;
  }

  async updateReferrer(
    practiceId: string,
    referrerId: string,
    referrerData: Partial<Referrers>,
  ): Promise<Referrers | undefined> {
    const video = await this.getReferrerById(practiceId, referrerId);
    const updatedVideo = this.referrers.merge(video, referrerData);
    return this.referrers.save(updatedVideo);
  }

  // async getReferrer(practiceId: string, page: string, limit: string) { //commenting this code to be implemented in future
  async getReferrer(practiceId: string) {
    /* commenting this code to be implemented in future
    const numberOfRecords = parseInt(limit);
    const skip = (parseInt(page) - 1) * numberOfRecords;
    */
    const referrers = await this.referrers.find({
      where: { practiceId },
      /* commenting this code to be implemented in future
      skip,
      take: numberOfRecords,
      */
    });

    return referrers;
  }
}
