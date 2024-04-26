import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferrersEntity } from '@packages/entities/referrer';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ReferrersService {
  constructor(
    @InjectRepository(ReferrersEntity)
    private readonly referrers: Repository<ReferrersEntity>,
  ) {}

  async createReferrer(
    practiceId: string,
    referrerData: Partial<ReferrersEntity>,
  ): Promise<ReferrersEntity> {
    const referrer = this.referrers.create({ ...referrerData, practiceId });
    return await this.referrers.save(referrer);
  }

  async deleteReferrer(practiceId: string, id: string): Promise<void> {
    await this.referrers.softDelete({
      id,
      practiceId,
    });
  }

  async getReferrerById(
    practiceId: string,
    referrerId: string,
  ): Promise<ReferrersEntity> {
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
    referrerData: Partial<ReferrersEntity>,
  ): Promise<ReferrersEntity | undefined> {
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
  ): Promise<ReferrersEntity[]> {
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
