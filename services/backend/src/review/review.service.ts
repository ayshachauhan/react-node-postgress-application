import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity } from '@packages/entities/*';
import { ReviewEntity } from '@packages/entities/review';
import Mail from 'nodemailer/lib/mailer';
import { PatientsService } from 'src/patients/patients.service';
import { PracticesService } from 'src/practices/practices.service';
import { Repository } from 'typeorm';
import { TransporterService } from '../transporter';
import { SystemTemplates } from '../transporter/transporter.types';
import { ReviewMailData } from './types';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviews: Repository<ReviewEntity>,
    private readonly transporterService: TransporterService,
    private jwtService: JwtService,
    private readonly practiceService: PracticesService,
    private readonly patientService: PatientsService,
  ) {}

  async createReview(
    practiceId: string,
    reviewData: Partial<ReviewEntity>,
  ): Promise<ReviewEntity> {
    const review = this.reviews.create({ ...reviewData, practiceId });
    return await this.reviews.save(review);
  }

  async sendReviewRequest(practiceId: string, reviewId: string) {
    const reviewData = await this.getReviewById(practiceId, reviewId);

    if (practiceId && reviewId) {
      const patientList: PatientEntity[] =
        await this.patientService.getUsersByPractice(practiceId);
      const reviewPatient: PatientEntity | undefined = patientList.find(
        (p) => p.id === reviewData.patientId,
      );
      const token: string = this.jwtService.sign({
        practiceId: practiceId,
        reviewId: reviewId,
        id: reviewPatient?.id,
      });

      const mailOptions: Mail.Options = {
        to: reviewPatient?.email,
        subject: 'Practice Optimizer Dashboard - Rate your visit',
      };

      const frontendBaseUrl: string | undefined =
        this.practiceService.getFrontEndBaseUrl();

      const mailData: ReviewMailData = {
        reviewLink: frontendBaseUrl + `/review/post?token=${token}`,
        patientName: reviewPatient?.firstName || '',
        practiceName: '',
      };

      await this.transporterService.sendSystemEmails(
        mailOptions,
        mailData,
        SystemTemplates.REVIEW_REQUEST,
      );
      console.log(`Review main sent to the patient`);
    } else {
      console.log(`Review data not inserted`);
    }
  }

  async deleteReview(practiceId: string, id: string): Promise<void> {
    await this.reviews.softDelete({
      id,
      practiceId,
    });
  }

  private async getReviewById(
    practiceId: string,
    reviewId: string,
  ): Promise<ReviewEntity> {
    const review = await this.reviews.findOne({
      where: { id: reviewId, practiceId },
    });
    if (!review) {
      throw new NotFoundException('Review not exists');
    }
    return review;
  }

  async updateReview(
    practiceId: string,
    reviewId: string,
    reviewData: Partial<ReviewEntity>,
  ): Promise<ReviewEntity | undefined> {
    const review = await this.getReviewById(practiceId, reviewId);
    const updatedReview = this.reviews.merge(review, reviewData);
    return this.reviews.save(updatedReview);
  }

  async getReviews(practiceId: string) {
    const reviews = await this.reviews.find({
      where: { practiceId },
    });
    return reviews;
  }

  async getReviewByName(practiceId: string): Promise<ReviewEntity[]> {
    const reviews = await this.reviews.find({
      where: [{ practiceId: practiceId }, { practiceId: practiceId }],
    });

    if (reviews.length === 0) {
      throw new NotFoundException('No reviews found with the given keyword');
    }

    return reviews;
  }
}
