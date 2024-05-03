import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferredPatient, SurgeryEntity } from '@packages/entities/*';
import { ReferrersEntity } from '@packages/entities/referrer';
import { SurgeryService } from 'src/surgery/surgery.service';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ReferrersService {
  constructor(
    @InjectRepository(ReferrersEntity)
    private readonly referrers: Repository<ReferrersEntity>,
    private readonly surgeryService: SurgeryService,
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
      relations: ['patients'],
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

  async getReferrerPatient(
    practiceId: string,
    referrerId: string,
  ): Promise<ReferredPatient[]> {
    const referrer = await this.referrers.findOne({
      where: { id: referrerId, practiceId },
      relations: ['patients'],
    });

    const resultArray: ReferredPatient[] = [];

    const filteredData =
      await this.surgeryService.getSurgeriesByReferredId(referrerId);

    interface GroupedSurgery {
      id: string;
      surgeries: SurgeryEntity[];
      firstName: string;
      lastName: string;
      dateCreated: Date;
      count: number;
    }

    const groupedSurgeries: GroupedSurgery[] = Object.values(
      filteredData.reduce((acc, surgery) => {
        const { id, patient, ...rest } = surgery;
        const patientId = patient.id;
        if (!acc[patientId]) {
          acc[patientId] = { ...patient, surgeries: [], count: 0 };
        }
        acc[patientId].surgeries.push({ id, ...rest });
        acc[patientId].count++;
        return acc;
      }, {}),
    );

    groupedSurgeries.forEach((element: GroupedSurgery) => {
      const newObj: ReferredPatient = {
        dateCreated: element.dateCreated,
        date: element.surgeries[0]?.date,
        firstName: element.firstName,
        lastName: element.lastName,
        lens: element.surgeries[0]?.lensType,
        billing: 'billing',
        count: element.count,
        id: element.id,
      };
      resultArray.push(newObj);
    });

    if (!referrer) {
      throw new NotFoundException('Referrer not exists');
    }
    return resultArray;
  }
}
