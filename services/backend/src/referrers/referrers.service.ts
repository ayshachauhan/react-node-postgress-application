import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferrersEntity } from '@packages/entities/referrer';
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
      relations: [
        'patients',
        'patients.surgeries',
        'patients.evals',
        'patients.surgeries.surgeryConfiguration',
        'patients.evals.surgeryConfiguration',
      ],
    });

    if (!referrer) {
      throw new NotFoundException('Referrer not exists');
    }

    if (referrer.patients && referrer.patients.length > 0) {
      referrer.patients.forEach((patient) => {
        if (patient.surgeries && patient.surgeries.length > 0) {
          patient.surgeries.sort((a, b) => {
            return (
              new Date(b.dateCreated).getTime() -
              new Date(a.dateCreated).getTime()
            );
          });
        }
        if (patient.evals && patient.evals.length > 0) {
          patient.evals.sort((a, b) => {
            return (
              new Date(b.dateCreated).getTime() -
              new Date(a.dateCreated).getTime()
            );
          });
        }
      });
    }

    return referrer;
  }

  async updateReferrer(
    practiceId: string,
    referrerId: string,
    referrerData: Partial<ReferrersEntity>,
  ): Promise<ReferrersEntity | undefined> {
    const referrer = await this.getReferrerById(practiceId, referrerId);
    const { email: userEmail } = referrerData;
    const { email: dbEmail } = referrer;
    const updatedReferrer = this.referrers.merge(referrer, referrerData);
    const result = await this.referrers.save(updatedReferrer);
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
        surgeries.filter(
          (surgery) => surgery?.patient?.referrer?.id === referrer?.id,
        ),
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
      relations: ['patients', 'patients.surgeries', 'patients.evals'],
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
