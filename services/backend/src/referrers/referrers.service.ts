import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Referrers } from '@packages/entities/referrer';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ReferrersService {
  constructor(
    @InjectRepository(Referrers)
    private readonly referrers: Repository<Referrers>,
  ) {}

  async createReferrer(
    practiceId: string,
    referrerData: Partial<Referrers>,
  ): Promise<Referrers> {
    const referrer = this.referrers.create({ ...referrerData, practiceId });
    return await this.referrers.save(referrer);
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
    const referrer = await this.getReferrerById(practiceId, referrerId);
    const updatedReferrer = this.referrers.merge(referrer, referrerData);
    return this.referrers.save(updatedReferrer);
  }

  async getReferrer(practiceId: string) {
    const referrers = await this.referrers.find({
      where: { practiceId },
    });
    return referrers;
  }

  async getReferrerByName(
    practiceId: string,
    keyword: string,
  ): Promise<Referrers[]> {
    const referrers = await this.referrers.find({
      where: [
        { firstName: ILike(`%${keyword}%`), practiceId: practiceId },
        { lastName: ILike(`%${keyword}%`), practiceId: practiceId },
      ],
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });

    if (referrers.length === 0) {
      throw new NotFoundException('No referrers found with the given keyword');
    }

    return referrers;
  }
}
