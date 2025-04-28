import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferrersEntity } from '@packages/entities/referrer';
import logger from 'src/logger';
import { PracticesService } from 'src/practices/practices.service';
import { SurgeryService } from 'src/surgery/surgery.service';
import { filterUpcomingSurgeries } from 'src/utils';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ReferrersService {
  constructor(
    @InjectRepository(ReferrersEntity)
    private readonly referrers: Repository<ReferrersEntity>,
    @Inject(forwardRef(() => SurgeryService))
    private surgeryService: SurgeryService,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
  ) {}

  async createReferrer(
    practiceId: string,
    referrerData: Partial<ReferrersEntity>,
  ): Promise<ReferrersEntity> {
    logger.info(
      `Starting the creation of new referrer with name ${referrerData?.firstName} ${referrerData?.lastName}`,
    );
    if (referrerData.email) {
      const existingReferrer = await this.getReferrerByEmail(
        referrerData.email,
        practiceId,
      );

      if (existingReferrer) {
        logger.warn(
          `Referrer with email ${referrerData.email} already exists in practice ${practiceId}`,
        );
        throw new BadRequestException(
          'A referrer with this email already exists.',
        );
      }
    }
    logger.info(
      `Creating new referrer with name ${referrerData?.firstName} ${referrerData?.lastName}`,
    );
    const referrer = this.referrers.create({ ...referrerData, practiceId });
    const savedReferrer = await this.referrers.save(referrer);
    logger.info(
      `New referrer created successfully with ID ${savedReferrer?.id}`,
    );
    return savedReferrer;
  }

  async deleteReferrer(practiceId: string, id: string): Promise<void> {
    logger.info(`Deleting referrer with ID: ${id}`);
    await this.referrers.softDelete({
      id,
      practiceId,
    });
    logger.info(`Referrer with ID: ${id} deleted successfully`);
  }

  async getReferrerById(
    practiceId: string,
    referrerId: string,
  ): Promise<ReferrersEntity> {
    const referrer = await this.referrers.findOne({
      where: { id: referrerId, practiceId },
      relations: [
        'surgeries',
        'evals',
        'pcpSurgeries',
        'pcpEvals',
        'surgeries.surgeryConfiguration',
        'evals.surgeryConfiguration',
        'surgeries.patient',
        'evals.patient',
        'pcpSurgeries.patient',
        'pcpEvals.patient',
        'pcpSurgeries.surgeryConfiguration',
        'pcpEvals.surgeryConfiguration',
      ],
    });

    if (!referrer) {
      throw new NotFoundException('Referrer not exists');
    }

    if (referrer.surgeries && referrer.surgeries.length > 0) {
      referrer.surgeries.sort((a, b) => {
        return (
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
      });
    }

    if (referrer.evals && referrer.evals.length > 0) {
      referrer.evals.sort((a, b) => {
        return (
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
      });
    }

    if (referrer.pcpSurgeries && referrer.pcpSurgeries.length > 0) {
      referrer.pcpSurgeries.sort((a, b) => {
        return (
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
      });
    }

    if (referrer.pcpEvals && referrer.pcpEvals.length > 0) {
      referrer.pcpEvals.sort((a, b) => {
        return (
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
      });
    }

    return referrer;
  }

  async updateReferrer(
    practiceId: string,
    referrerId: string,
    referrerData: Partial<ReferrersEntity>,
  ): Promise<ReferrersEntity | undefined> {
    logger.info(`Starting update for referrer with ID: ${referrerId}`);
    const referrer = await this.getReferrerById(practiceId, referrerId);
    const { email: userEmail } = referrerData;
    const { email: dbEmail } = referrer;
    if (userEmail && userEmail !== dbEmail) {
      const existing = await this.getReferrerByEmail(userEmail, practiceId);

      if (existing && existing.id !== referrerId) {
        logger.warn(
          `Cannot update referrer. Email ${userEmail} already exists in practice ${practiceId}`,
        );
        throw new BadRequestException(
          'Another referrer with this email already exists.',
        );
      }
    }
    const updatedReferrer = this.referrers.merge(referrer, referrerData);
    logger.info(`Updating referrer with ID: ${referrerId}`);
    const result = await this.referrers.save(updatedReferrer);
    logger.info(`Referrer with ID: ${referrerId} updated successfully`);
    if (!dbEmail && userEmail) {
      const { surgeries } = await this.surgeryService.findAll(
        practiceId,
        false,
        [],
        '',
        '',
        '',
      );
      const referrerSurgeries = filterUpcomingSurgeries(
        surgeries.filter((surgery) => surgery?.referrer?.id === referrer?.id),
      );
      const practiceEntity = await this.practiceService.findOne(practiceId);

      if (practiceEntity) {
        await Promise.all(
          referrerSurgeries.map((surgery) =>
            this.surgeryService.initiateReferrerSendEmail(
              surgery,
              practiceEntity,
            ),
          ),
        );
      }
    }
    return result;
  }

  async getReferrer(practiceId: string) {
    const referrers = await this.referrers.find({
      where: { practiceId },
      relations: [
        'surgeries',
        'evals',
        'pcpSurgeries',
        'pcpEvals',
        'surgeries.patient',
        'evals.patient',
        'pcpSurgeries.patient',
        'pcpEvals.patient',
      ],
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

  async getReferrerByEmail(
    email: string,
    practiceId: string,
  ): Promise<ReferrersEntity | null> {
    const referrer = await this.referrers.findOne({
      where: { email, practiceId },
    });

    return referrer ?? null;
  }
}
