import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/practice';
import { UserEntity, UserType } from '@packages/entities/user';
// import Mail from 'nodemailer/lib/mailer';
// import { SystemTemplates } from 'src/transporter/transporter.types';
import { UploadType } from 'src/users/types';
import { getUploadFileKey } from 'src/users/utils';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
// import { TransporterService } from '../transporter';
import { UpdateUserDto } from 'src/users/dto/update.dto';
import { S3Service } from '../users/s3.service';
import { UsersService } from '../users/users.service';
import { PracticeCreateDto } from './dto/create.dto';
import { PracticePatchDto } from './dto/patch.dto';
import {
  // CreatePracticeInviteMailData,
  PracticesGetInterface,
  UploadPracticeImgData,
} from './types';

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    // private readonly transporterService: TransporterService,
    private dataSource: DataSource,
    // private jwtService: JwtService,
    private configService: ConfigService,
    private readonly s3Service: S3Service,
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
      const { id, name, code, status, imgUrl, emailData } = element;
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

      const adminUser = dbUsersByPractice[0];
      const finalPractice: PracticesGetInterface = {
        id,
        name,
        code,
        status,
        imgUrl,
        emailData,
      };

      if (adminUser) {
        finalPractice.adminFirstName = adminUser.firstName;
        finalPractice.adminLastName = adminUser.lastName;
        finalPractice.adminEmail = adminUser.email;
        finalPractice.adminContactNumber = adminUser.contactNumber;
        finalPractice.adminId = adminUser.id;
      }
      resultArray.push(finalPractice);
    });

    return resultArray;
  }

  async findOne(id: string): Promise<PracticeEntity | null> {
    return await this.practicesRepository.findOne({
      where: { id },
      relations: ['users', 'users.permissions', 'users.surgeries'],
    });
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
      const existingUser = await this.userService.getUserByEmail(adminEmail);

      const existingPractice: PracticeEntity | undefined =
        existingUser?.practices.find(
          (practice: PracticeEntity) => practice.name === name,
        );

      if (existingPractice) {
        throw new HttpException(
          `Practice with name ${name} already exists.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const newPractice: PracticeEntity = this.practicesRepository.create({
        name,
        code,
      });

      const practice: PracticeEntity =
        await this.practicesRepository.save(newPractice);

      // creating admin user
      const sendUserCreationEmail: boolean = true;
      await this.userService.create(
        {
          firstName: adminFirstName,
          lastName: adminLastName,
          email: adminEmail,
          userName: `${adminEmail}`,
          type: UserType.ADMIN,
          url: '',
          designation: '',
          contactNumber: adminContactNumber,
          permissionIds: [],
        },
        practice.id,
        sendUserCreationEmail,
      );

      // const token: string = this.jwtService.sign({
      //   ...newAdmin,
      //   practiceId: practice.id,
      // });

      // const mailOptions: Mail.Options = {
      //   to: newAdmin.email,
      //   subject:
      //     'Welcome to Practice Optimizer Dashboard - Complete Your Sign-up Process',
      // };

      // const frontendBaseUrl: string | undefined = this.getFrontEndBaseUrl();

      // const mailData: CreatePracticeInviteMailData = {
      //   signUpLink: frontendBaseUrl + `/onboarding/practice?token=${token}`,
      //   practiceName: practice.name,
      //   userFirstName: adminFirstName,
      //   userLastName: adminLastName,
      //   contactEmail: adminEmail,
      //   contactPhone: adminContactNumber,
      // };

      // await this.transporterService.sendSystemEmails(
      //   mailOptions,
      //   mailData,
      //   SystemTemplates.ADMIN_INVITE,
      // );
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sanitizedPracticePayload: Partial<PracticePatchDto> = {
        name: practicePatchDto.name,
        status: practicePatchDto.status,
        code: practicePatchDto.code,
        imgUrl: practicePatchDto.imgUrl,
      };
      const sanitizedUserPayload: Partial<UpdateUserDto> = {
        contactNumber: practicePatchDto.adminContactNumber,
        lastName: practicePatchDto.adminLastName,
        firstName: practicePatchDto.adminFirstName,
      };

      const practiceUpdateResult: UpdateResult =
        await this.practicesRepository.update(id, sanitizedPracticePayload);

      if (practiceUpdateResult.affected === 0) {
        throw new HttpException(
          `Practice with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const adminUser = practicePatchDto.adminId;
      const userToUpdate = await this.userService.getUserById(adminUser);
      if (!userToUpdate) {
        throw new HttpException(
          `User with id ${adminUser} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const adminUpdateResult = await this.userService.updateUser(
        practicePatchDto.adminId,
        sanitizedUserPayload as UpdateUserDto, // Type assertion here
      );

      if (adminUpdateResult === null) {
        throw new HttpException(
          `User with id ${adminUser} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      await queryRunner.commitTransaction();

      return await this.practicesRepository.findOne({ where: { id } });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async uploadPracticeImg({
    practiceId,
    file,
  }: UploadPracticeImgData): Promise<PracticeEntity> {
    const key: string = getUploadFileKey(UploadType.PRACTICE, {
      practiceId,
      file,
    });

    const uploadImg = await this.s3Service.uploadFile(file, key);

    //@ts-expect-error only need to send url from here
    return this.update(practiceId, { imgUrl: uploadImg.Location });
  }
}
