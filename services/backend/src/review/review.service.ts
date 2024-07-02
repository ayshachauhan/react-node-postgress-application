import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity } from '@packages/entities';
import {
  PostUserReview,
  ReviewEntity,
  ReviewStatus,
} from '@packages/entities/review';
import Mail from 'nodemailer/lib/mailer';
import { PatientsService } from 'src/patients/patients.service';
import { PracticesService } from 'src/practices/practices.service';
import { Repository } from 'typeorm';
import logger from '../logger';
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
    reviewData: Partial<ReviewEntity>[],
  ): Promise<ReviewEntity[]> {
    return await this.reviews.save(reviewData);
  }

  async sendReviewRequest(practiceId: string, reviewId: string) {
    try {
      const reviewData = await this.getReviewById(reviewId);

      if (practiceId && reviewData) {
        const patientList: PatientEntity[] =
          await this.patientService.getPatientsByPractice(practiceId);
        const reviewPatient: PatientEntity | undefined = patientList.find(
          (p) => p.id === reviewData.patient.id,
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
          reviewLink: frontendBaseUrl + `/post/review/${practiceId}?r=${token}`,
          patientName: reviewPatient?.firstName || '',
          practiceName: '',
        };

        await this.transporterService.sendSystemEmails(
          mailOptions,
          mailData,
          SystemTemplates.REVIEW_REQUEST,
        );

        const reviewResponse = await this.updateReview(reviewId, {
          reviewStatus: ReviewStatus.SENT,
          reviewRequestDate: new Date(),
        });

        return reviewResponse;
      } else {
        logger.info(`Practice Id or Review id is missing`, [
          practiceId,
          reviewId,
        ]);
        throw new HttpException(
          'Invalid review request',
          HttpStatus.PRECONDITION_FAILED,
        );
      }
    } catch (ex) {
      logger.error(ex);
      throw new HttpException(
        'An error occured in sending review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateReviewRequest(practice_id: string, _token: string) {
    try {
      const jwtResponse = await this.jwtService.verify(_token);
      const { practiceId, reviewId, id: patientId } = jwtResponse;

      if (practiceId && reviewId && patientId) {
        const patientList: PatientEntity[] =
          await this.patientService.getPatientsByPractice(practice_id);
        const reviewPatient: PatientEntity | undefined = patientList.find(
          (p) => p.id === patientId,
        );

        const review = await this.getReviewById(reviewId);
        if (!review || !reviewPatient) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Invalid review link',
          };
        } else if (review.patient.id != reviewPatient.id) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Invalid review link',
          };
        }

        if (review.reviewStatus === ReviewStatus.RECEIVED) {
          return { status: HttpStatus.FOUND, message: 'Review already exist' };
        } else if (review.reviewStatus === ReviewStatus.PENDING) {
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Invalid review link',
          };
        }

        return {
          status: HttpStatus.OK,
          message: 'Valid review request',
          id: reviewId,
        };
      } else {
        return {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'Invalid review request',
        };
      }
    } catch (ex) {
      if (ex instanceof TokenExpiredError) {
        throw new HttpException(
          'Review link is expired',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          'An error occured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async postUserReview(_practice_id: string, payloadData: PostUserReview) {
    const { rating, reviewComment, token } = payloadData;
    const validRequest = await this.validateReviewRequest(_practice_id, token);
    if (validRequest.status === HttpStatus.OK) {
      return this.updateReview(validRequest.id, {
        reviewStatus: ReviewStatus.RECEIVED,
        reviewPostDate: new Date(),
        reviewComment: reviewComment,
        userRating: rating,
      });
    } else {
      throw new BadRequestException('User review parameter missing');
    }
  }

  async deleteReview(id: string): Promise<void> {
    await this.reviews.softDelete({
      id,
    });
  }

  private async getReviewById(reviewId: string): Promise<ReviewEntity> {
    const review = await this.reviews.findOne({
      where: { id: reviewId },
      relations: ['practice', 'patient'],
    });
    if (!review) {
      throw new NotFoundException('Review not exists');
    }
    return review;
  }

  async updateReview(
    reviewId: string,
    reviewData: Partial<ReviewEntity>,
  ): Promise<ReviewEntity | undefined> {
    const review = await this.getReviewById(reviewId);
    const updatedReview = this.reviews.merge(review, reviewData);
    return this.reviews.save(updatedReview);
  }

  async getReviews(practiceId: string) {
    const reviews = await this.reviews.find({
      where: { practice: { id: practiceId } },
      relations: ['practice', 'patient'],
    });
    return reviews;
  }

  async getReviewByName(practiceId: string): Promise<ReviewEntity[]> {
    console.log(practiceId);
    const reviews = await this.reviews.find({
      // where: [{ practiceId: practiceId }, { practiceId: practiceId }],
    });

    if (reviews.length === 0) {
      throw new NotFoundException('No reviews found with the given keyword');
    }

    return reviews;
  }
}
