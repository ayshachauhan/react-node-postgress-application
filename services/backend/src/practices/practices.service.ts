import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Mail from 'nodemailer/lib/mailer';
import { User } from 'src/entities/users.entity';
import { TransporterService } from 'src/transporter';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { PracticeEntity } from '../entities/practices.entity';
import { UserStatus } from '../enums/status.enum';
import { UserType } from '../enums/userType.enum';
import { UsersService } from '../users/users.service';
import { PracticeCreateDto } from './dto/create.dto';
import { sendPracticeAdminInvite } from './emailTemplates/adminInvite';
import { PracticesGetInterface } from './types';

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly transporterService: TransporterService,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<PracticesGetInterface[]> {
    const resultArray: PracticesGetInterface[] = [];
    const dbPractices = await this.practicesRepository.find({
      relations: ['users'],
      order: {
        name: 'ASC',
      },
    });

    dbPractices.forEach((element: PracticeEntity) => {
      const { id, name, code, status } = element;
      const dbUsersByPractice: User[] = element.users.sort((a, b) => {
        const timestampA = a.dateCreated.getTime();
        const timestampB = b.dateCreated.getTime();

        if (timestampA < timestampB) {
          return -1;
        } else if (timestampA > timestampB) {
          return 1;
        } else {
          return 0;
        }
      });

      const adminUser = dbUsersByPractice.find((ele) => ele.type === 'admin');
      const finalPractice: PracticesGetInterface = { id, name, code, status };

      if (adminUser) {
        finalPractice.adminFirstName = adminUser.firstName;
        finalPractice.adminLastName = adminUser.lastName;
        finalPractice.adminEmail = adminUser.email;
        finalPractice.adminContactNumber = adminUser.contactNumber;
      }
      resultArray.push(finalPractice);
    });

    return resultArray;
  }

  async findOne(id: string): Promise<PracticeEntity | null> {
    return await this.practicesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.practicesRepository.softDelete(id);
  }
  async create({
    name,
    adminEmail,
    adminContactNumber,
    adminFirstName,
    adminLastName,
    code,
  }: PracticeCreateDto): Promise<PracticeEntity> {
    // initiating transaction as multiple table operations are in queue
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newPractice: PracticeEntity = new PracticeEntity();

      const practice = await this.practicesRepository.save({
        ...newPractice,
        name,
        code,
      });

      // creating admin user
      const newAdmin = await this.userService.create(
        {
          firstName: adminFirstName,
          lastName: adminLastName,
          email: adminEmail,
          userName: `${adminEmail}`,
          status: UserStatus.ACTIVE,
          type: UserType.ADMIN,
          url: '',
          contactNumber: adminContactNumber,
        },
        practice.id,
      );
      const mailOptions: Mail.Options = {
        to: newAdmin.email,
        subject:
          'Subject: Welcome to Surgery Scheduler Portal - Complete Your Sign-up Process',
        html: sendPracticeAdminInvite,
        text: 'text message',
      };
      const mailData = {
        signUpLink:
          process.env.FRONT_END_BASE_URL +
          `/onboarding/practice?practiceId=${
            practice.id
          }&email=${encodeURIComponent(adminEmail)}`,
        practiceName: practice.name,
        userFirstName: adminFirstName,
        userLastName: adminLastName,
        contactEmail: adminEmail,
        contactPhone: adminContactNumber,
      };
      await this.transporterService.sendEmail(mailOptions, mailData);
      await queryRunner.commitTransaction();

      return practice;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, practicePatchDto): Promise<PracticeEntity | null> {
    const updateResult: UpdateResult = await this.practicesRepository.update(
      id,
      practicePatchDto,
    );

    if (updateResult.affected === 0) {
      throw new HttpException(
        `Practice with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.practicesRepository.findOne({ where: { id } });
  }
}
