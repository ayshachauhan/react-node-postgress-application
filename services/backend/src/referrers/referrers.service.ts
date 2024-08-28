import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity } from '@packages/entities/patient';
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
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
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

  async getReferrerByIdOld(
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
        'patientsByPcp',
        'patientsByPcp.surgeries',
        'patientsByPcp.evals',
        'patientsByPcp.surgeries.surgeryConfiguration',
        'patientsByPcp.evals.surgeryConfiguration',
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

    // Fetch patients and related data for the referrer
    const patients = await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.referrer', 'referrer')
      .leftJoinAndSelect('patient.pcp', 'pcp')
      .leftJoinAndSelect('patient.surgeries', 'surgeries')
      .leftJoinAndSelect(
        'surgeries.surgeryConfiguration',
        'surgeryConfiguration',
      )
      .leftJoinAndSelect('patient.evals', 'evals')
      .leftJoinAndSelect(
        'evals.surgeryConfiguration',
        'evalSurgeryConfiguration',
      )
      .where('patient.referrerId = :referrerId', { referrerId })
      .andWhere('patient.practiceId = :practiceId', { practiceId })
      .getMany();

    // Fetch patients by PCP
    const patientsByPcp = await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.pcp', 'pcp')
      .leftJoinAndSelect('patient.surgeries', 'surgeries')
      .leftJoinAndSelect(
        'surgeries.surgeryConfiguration',
        'pcpSurgeryConfiguration',
      )
      .leftJoinAndSelect('patient.evals', 'evals')
      .leftJoinAndSelect(
        'evals.surgeryConfiguration',
        'pcpEvalSurgeryConfiguration',
      )
      .where('patient.pcp = :referrerId', { referrerId })
      .andWhere('patient.practiceId = :practiceId', { practiceId })
      .getMany();

    referrer.patients = patients;
    referrer.patientsByPcp = patientsByPcp;

    // Sort surgeries and evals
    referrer.patients.forEach((patient) => {
      patient.surgeries?.sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
      );
      patient.evals?.sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
      );
    });

    referrer.patientsByPcp.forEach((patient) => {
      patient.surgeries?.sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
      );
      patient.evals?.sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
      );
    });

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

  async getReferrerOld(practiceId: string) {
    const referrers = await this.referrers.find({
      where: { practiceId },
      relations: ['patients', 'patients.surgeries', 'patients.evals'],
    });
    return referrers;
  }

  async getReferrer(practiceId: string) {
    const referrers = await this.referrers.find({
      where: { practiceId },
    });

    const referrerIds = referrers.map((referrer) => referrer.id);

    // Fetch patients for referrers
    const patients = await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.referrer', 'referrer')
      .leftJoinAndSelect('patient.pcp', 'pcp')
      .leftJoinAndSelect('patient.surgeries', 'surgeries')
      .leftJoinAndSelect('patient.evals', 'evals')
      .where('patient.referrerId IN (:...referrerIds)', { referrerIds })
      .andWhere('patient.practiceId = :practiceId', { practiceId })
      .getMany();

    // Fetch patientsByPcp for referrers
    const patientsByPcp = await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.referrer', 'referrer')
      .leftJoinAndSelect('patient.pcp', 'pcp')
      .leftJoinAndSelect('patient.surgeries', 'surgeries')
      .leftJoinAndSelect('patient.evals', 'evals')
      .where('patient.pcp IN (:...referrerIds)', { referrerIds })
      .andWhere('patient.practiceId = :practiceId', { practiceId })
      .getMany();

    const enrichedReferrers = referrers.map((referrer) => ({
      ...referrer,
      patients: patients.filter(
        (patient) => patient?.referrer?.id === referrer?.id,
      ),
      patientsByPcp: patientsByPcp.filter(
        (patient) => patient?.pcp?.id === referrer?.id,
      ),
    }));

    return enrichedReferrers;
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
