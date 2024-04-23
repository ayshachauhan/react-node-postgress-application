import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/practice';
import { UserEntity, UserStatus, UserType } from '@packages/entities/user';
import Mail from 'nodemailer/lib/mailer';
import { SystemTemplates } from 'src/transporter/transporter.types';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { TransporterService } from '../transporter';
import { UsersService } from '../users/users.service';
import { PracticeCreateDto } from './dto/create.dto';
import { CreatePracticeInviteMailData, PracticesGetInterface } from './types';

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly transporterService: TransporterService,
    private dataSource: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getFrontEndBaseUrl(): string | undefined {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

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
      const dbUsersByPractice: UserEntity[] = element.users.sort((a, b) => {
        // sorting on the basis of createdAt to get oldest admin in the for the practice. considering it the actual practice admin
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
      const newPractice: PracticeEntity = this.practicesRepository.create({
        name,
        code,
      });

      const practice: PracticeEntity =
        await this.practicesRepository.save(newPractice);

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

      const token: string = this.jwtService.sign({
        ...newAdmin,
        practiceId: practice.id,
      });

      const mailOptions: Mail.Options = {
        to: newAdmin.email,
        subject:
          'Subject: Welcome to Practice Optimizer Dashboard - Complete Your Sign-up Process',
      };

      const frontendBaseUrl: string | undefined = this.getFrontEndBaseUrl();

      const mailData: CreatePracticeInviteMailData = {
        signUpLink: frontendBaseUrl + `/onboarding/practice?token=${token}`,
        practiceName: practice.name,
        userFirstName: adminFirstName,
        userLastName: adminLastName,
        contactEmail: adminEmail,
        contactPhone: adminContactNumber,
      };

      await this.transporterService.sendSystemEmails(
        mailOptions,
        mailData,
        SystemTemplates.ADMIN_INVITE,
      );
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
