import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '@packages/entities/review';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviews: Repository<Review>,
  ) {}

  async createReferrer(
    practiceId: string,
    referrerData: Partial<Review>,
  ): Promise<Review> {
    const referrer = this.reviews.create({ ...referrerData, practiceId });
    return await this.reviews.save(referrer);
  }

  async deleteReview(practiceId: string, id: string): Promise<void> {
    await this.reviews.softDelete({
      id,
      practiceId,
    });
  }

  private async getReferrerById(
    practiceId: string,
    referrerId: string,
  ): Promise<Review> {
    const referrer = await this.reviews.findOne({
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
    referrerData: Partial<Review>,
  ): Promise<Review | undefined> {
    const referrer = await this.getReferrerById(practiceId, referrerId);
    const updatedReferrer = this.reviews.merge(referrer, referrerData);
    return this.reviews.save(updatedReferrer);
  }

  async getReferrer(practiceId: string) {
    const reviews = await this.reviews.find({
      where: { practiceId },
    });
    return reviews;
  }

  async getReviewByName(practiceId: string): Promise<Review[]> {
    const reviews = await this.reviews.find({
      where: [{ practiceId: practiceId }, { practiceId: practiceId }],
    });

    if (reviews.length === 0) {
      throw new NotFoundException('No reviews found with the given keyword');
    }

    return reviews;
  }
}
