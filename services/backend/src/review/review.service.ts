import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ISurgery, PatientEntity } from '@packages/entities';
import {
  PostUserReview,
  ReviewEntity,
  ReviewStatus,
} from '@packages/entities/review';
import { EmailHandlerService } from 'src/emailHandler/emailHandler.service';
import { PatientsService } from 'src/patients/patients.service';
import { PracticesService } from 'src/practices/practices.service';
import { SurgeryService } from 'src/surgery/surgery.service';
import { toPascalCase } from 'src/utils';
import { Repository } from 'typeorm';
import logger from '../logger';
import { SystemTemplates } from '../transporter/transporter.types';
import { ReviewMailData } from './types';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviews: Repository<ReviewEntity>,
    @Inject(forwardRef(() => EmailHandlerService))
    private readonly emailHandlerService: EmailHandlerService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => PracticesService))
    private readonly practiceService: PracticesService,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientService: PatientsService,
    @Inject(forwardRef(() => SurgeryService))
    private readonly surgeryService: SurgeryService,
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
        const surgeryId = reviewData?.surgeryId;

        const patientList: PatientEntity[] =
          await this.patientService.getPatientsByPractice(practiceId);
        const reviewPatient: PatientEntity | undefined = patientList.find(
          (p) => p.id === reviewData.patient.id,
        );

        //  Commented this code because client wanted to send doctor's review link in the email.
        // const token: string = this.jwtService.sign({
        //   practiceId: practiceId,
        //   reviewId: reviewId,
        //   id: reviewPatient?.id,
        // });

        // const frontendBaseUrl: string | undefined =
        //   this.practiceService.getFrontEndBaseUrl();
        let surgery: ISurgery | null = null;
        if (surgeryId) {
          surgery = await this.surgeryService.getSurgeryById(surgeryId);
        }

        let mailData: ReviewMailData = {
          reviewLink: '',
          fname: reviewPatient?.firstName || '',
          lname: reviewPatient?.lastName || '',
          phoneNumber: reviewPatient?.phoneNumber || '',
          mrn: reviewPatient ? String(reviewPatient?.mrn) : '',
          Laterality: surgery ? toPascalCase(surgery.bodyPart) : '',
          surgery_type: surgery ? surgery.surgeryConfiguration.name : '',
          patientName: reviewPatient?.firstName || '',
          practiceName: '',
          to: reviewPatient ? reviewPatient?.email : '',
          pt_email_address: reviewPatient ? reviewPatient?.email : '',
        };

        if (surgeryId) {
          const surgeryData =
            await this.surgeryService.getSurgeryById(surgeryId);
          const doctor = surgeryData?.doctor;
          const reviewLink = doctor?.reviewLinkURL;
          if (reviewLink) {
            mailData = { ...mailData, reviewLink };
          } else {
            throw new HttpException(
              'Your page review URL is missing in POD app. Please contact to Practiec Admin.',
              HttpStatus.PRECONDITION_FAILED,
            );
          }
        } else {
          throw new HttpException(
            'Associated surgery not found in the system',
            HttpStatus.PRECONDITION_FAILED,
          );
        }

        if (reviewData?.reviewStatus === ReviewStatus.PENDING) {
          await this.initiateSendReviewEmail(practiceId, mailData);

          const reviewResponse = await this.updateReview(reviewId, {
            reviewStatus: ReviewStatus.SENT,
            reviewRequestDate: new Date(),
          });

          return reviewResponse;
        } else {
          logger.info(
            `Review status is ${reviewData?.reviewStatus}. So review request can’t be sent to the patient.`,
            [practiceId, reviewId, reviewData?.reviewStatus],
          );
          throw new HttpException(
            `Review status is ${reviewData?.reviewStatus}. So review request can’t be sent to the patient.`,
            HttpStatus.PRECONDITION_FAILED,
          );
        }
      } else {
        logger.info(`Review request is not associated to any practice`, [
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
        ex ?? 'An error occured in sending review',
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
      order: {
        dateCreated: 'DESC',
      },
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

  async initiateSendReviewEmail(
    practiceId: string,
    mailData: ReviewMailData,
  ): Promise<void> {
    const practice = await this.practiceService.findOne(practiceId);
    const systemGeneratedMailData = {
      subject: 'Practice Optimizer Dashboard - Rate your visit',
      text: '',
      systemTemplate: SystemTemplates.REVIEW_REQUEST,
    };

    if (practice) {
      await this.emailHandlerService.checkAndMakeReviewEmailContent(
        practice,
        mailData,
        systemGeneratedMailData,
      );
    }
  }
}
