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
import {
  IPractice,
  IUser,
  PracticeEntity,
  PracticeStatus,
  UserEntity,
  UserStatus,
  UserType,
} from '@packages/entities';
import * as bcrypt from 'bcrypt';
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import logger from 'src/logger';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PracticesService } from 'src/practices/practices.service';
import { TransporterService } from 'src/transporter';
import { SystemTemplates } from 'src/transporter/transporter.types';
import {
  NewUserMailData,
  SanitizedUser,
  UploadType,
  UploadUserImgData,
} from 'src/users/types';
import { decryptPassword } from 'src/utils';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { S3Service } from './s3.service';
import { getUploadFileKey } from './utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => PracticesService))
    private readonly practicesService: PracticesService,
    private readonly permissionsService: PermissionsService,
    private readonly configService: ConfigService,
    private readonly transporterService: TransporterService,
    private jwtService: JwtService,
    private dataSource: DataSource,
    private readonly s3Service: S3Service,
  ) {}

  defaultUserPassword() {
    return this.configService.get(ENVIRONMENT_VARIABLES.DEFAULT_USER_PASSWORD);
  }
  getFrontEndBaseUrl() {
    return this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL);
  }

  async create(
    createUserDto: CreateUserDto,
    practiceId: string,
    sendUserCreationEmail: boolean,
    isCallingFromPractice: boolean = false,
  ): Promise<SanitizedUser> {
    logger.info(
      `Starting creation of new user with name ${createUserDto?.firstName} ${createUserDto?.lastName} `,
    );
    const { firstName, lastName } = createUserDto;
    const { permissionIds } = createUserDto;
    const fullName = `${firstName} ${lastName}`;
    const hashedDefaultPassword = await bcrypt.hash(
      this.defaultUserPassword(),
      10,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const practiceEntity = await this.practicesService.findOne(practiceId);
      if (!practiceEntity) {
        throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
      }

      const permissionEntities =
        await this.permissionsService.getPermissionByIds(permissionIds);

      const existingUser: UserEntity | null = await this.getUserByEmail(
        createUserDto.email,
      );

      let newUser: UserEntity = new UserEntity();

      if (!existingUser) {
        logger.info(
          `Creating new user with name ${createUserDto?.firstName} ${createUserDto?.lastName} `,
        );
        newUser = await this.usersRepository.save({
          ...newUser,
          ...createUserDto,
          status: UserStatus.PENDING,
          fullName,
          password: hashedDefaultPassword,
          practices: [practiceEntity],
          permissions: permissionEntities || [],
        });
        logger.info(`New user created successfully with ID: ${newUser?.id} `);

        if (sendUserCreationEmail || !isCallingFromPractice) {
          await this.sendNewUserMail({ newUser, fullName, practiceEntity });
        }
      } else {
        const emailExists = existingUser.practices.find(
          (ele) => ele.id == practiceId,
        );
        if (emailExists) {
          throw new HttpException(
            'User for this email already exists',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        existingUser.practices.push(practiceEntity);
        await this.usersRepository.save({
          ...existingUser,
        });
        logger.info(
          `Existing user with ID: ${existingUser?.id} updated successfully`,
        );

        newUser = existingUser;
        if (sendUserCreationEmail) {
          await this.sendNewPracticeMailToExistingUser({
            newUser,
            fullName,
            practiceEntity,
          });

          await this.practicesService.update(practiceId, {
            status: PracticeStatus.ACTIVE,
          });
          logger.info(
            `Existing practice with ID: ${practiceId} updated successfully`,
          );
        }
      }

      await queryRunner.commitTransaction();
      return this.sanitizeUser(newUser);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    return existingUser;
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['practices', 'permissions'],
    });
  }

  async getUsersByPractice(practiceId: string): Promise<UserEntity[]> {
    const practice: PracticeEntity | null =
      await this.practicesService.findOne(practiceId);

    return practice?.users ?? [];
  }

  async deleteUser(id: string): Promise<void> {
    const userEntity = await this.getUserById(id);
    if (!userEntity) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    logger.info(`Deleting user with ID ${id}`);
    await this.usersRepository.softDelete(id);
    logger.info(`User with ID ${id} deleted successfully`);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SanitizedUser | null> {
    logger.info(`Starting update for user with ID: ${id}`);
    const userToUpdate = await this.getUserById(id);
    if (!userToUpdate) {
      logger.info(`User with id ${id} not found`);
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = this.usersRepository.merge(userToUpdate, updateUserDto);

    if (updateUserDto.permissionIds) {
      const permissionEntities =
        await this.permissionsService.getPermissionByIds(
          updateUserDto.permissionIds,
        );
      if (!permissionEntities) {
        throw new HttpException(`Permissions not found`, HttpStatus.NOT_FOUND);
      }
      updatedUser.permissions = permissionEntities;
    }
    logger.info(`Updating user with ID: ${id}`);

    const savedUser = await this.usersRepository.save(updatedUser);

    if (savedUser) {
      logger.info(`User with ID: ${id} updated successfully`);
      return this.sanitizeUser(savedUser);
    }
    return null;
  }

  sanitizeUser(user: UserEntity): SanitizedUser {
    const { password, ...sanitizedUser } = user;
    password && password;
    return {
      ...sanitizedUser,
    };
  }

  async changePassword({
    changePasswordDto,
    practiceId,
  }): Promise<SanitizedUser> {
    logger.info(
      `Starting change password process for user with email ${changePasswordDto?.email}`,
    );
    const { email, newPassword, confirmPassword, oldPassword, token } =
      changePasswordDto;

    const decryptedNewPassword = decryptPassword(newPassword);
    const decryptedConfirmPassword = decryptPassword(confirmPassword);
    const decryptedOldPassword = decryptPassword(oldPassword);

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}:;"'<>,.?/-])[A-Za-z\d!@#$%^&*()_+={}:;"'<>,.?/-]{8,20}$/;

    if (!passwordRegex.test(decryptedNewPassword)) {
      throw new HttpException(
        'Password must be 8-20 characters long, containing at least one uppercase, one lowercase, one numeric & one special character.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (decryptedConfirmPassword !== decryptedNewPassword) {
      throw new HttpException(
        'Password does not match',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const user = await this.findUserByEmail(email);
    if (user) {
      const newHashedPassword = await bcrypt.hash(decryptedNewPassword, 10);

      if (!decryptedOldPassword) {
        // meaning that user is reseting own password only.
        if (!user?.token && token) {
          throw new HttpException(
            `This link has been already used. Please request a new one.`,
            HttpStatus.PRECONDITION_FAILED,
          );
        }
        if (user.status == UserStatus.ACTIVE && (user?.token || !token)) {
          logger.info(`Updating user with ID ${user.id}`);
          const updatedResult = await this.usersRepository.update(user.id, {
            password: newHashedPassword,
            token: '',
          });
          if (updatedResult.affected === 0) {
            logger.info(
              `Password update failed due to some error for user ID ${user.id}`,
            );
            throw new HttpException(
              `Password update failed due to some error`,
              HttpStatus.NOT_MODIFIED,
            );
          } else {
            logger.info(`Password updated successfully for user ID ${user.id}`);
          }
        } else {
          throw new HttpException(
            'Your account seems to be inactive at our end. Please contact to support.',
            HttpStatus.PRECONDITION_FAILED,
          );
        }
      }

      const isPasswordMatched = await bcrypt.compare(
        decryptedOldPassword,
        user.password,
      );

      if (isPasswordMatched) {
        logger.info(`Updating user with ID ${user.id}`);
        const updatedResult = await this.usersRepository.update(user.id, {
          password: newHashedPassword,
          status: UserStatus.ACTIVE,
        });

        // if admin is changing password and the password is default. then setting practice status as active
        if (
          user.type == UserType.ADMIN &&
          decryptedOldPassword == this.defaultUserPassword()
        ) {
          logger.info(`Updating practice with ID ${practiceId}`);
          await this.practicesService.update(practiceId, {
            status: PracticeStatus.ACTIVE,
          });
          logger.info(`Practice with ID ${practiceId} updated successfully`);
        }

        if (updatedResult.affected === 0) {
          logger.info(
            `Password update failed due to some error for user with ID ${user.id}`,
          );
          throw new HttpException(
            `Password update failed due to some error`,
            HttpStatus.NOT_MODIFIED,
          );
        } else {
          logger.info(`User with ID ${user.id} updated successfully`);
        }
      }

      const resultUser = await this.getUserById(user.id);
      if (resultUser) {
        return this.sanitizeUser(resultUser);
      }
    } else {
      throw new HttpException(
        `User email is not registered with us! Please enter registered email.`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    throw new HttpException(`error while updating`, HttpStatus.NOT_ACCEPTABLE);
  }

  async sendNewUserMail({
    newUser,
    fullName,
    practiceEntity,
  }: {
    newUser: UserEntity;
    fullName: string;
    practiceEntity: IPractice;
  }): Promise<void> {
    const frontendBaseUrl: string = this.getFrontEndBaseUrl();
    const { password, practices, permissions, surgeries, ...newSanitizedUser } =
      newUser;

    password && password;
    practices && practices;
    permissions && permissions;
    surgeries && surgeries;

    const token = this.jwtService.sign({
      ...newSanitizedUser,
    });

    // Read the HTML file content

    const mailOptions: Mail.Options = {
      to: newSanitizedUser.email,
      subject:
        'Welcome to Practice Optimization Dashboard - Complete Your Sign-up Process',
      text: 'text message',
    };

    const mailData: NewUserMailData = {
      signUpLink: frontendBaseUrl + `/onboarding/user?token=${token}`,
      practiceName: practiceEntity.name,
      fullName,
      defaultUserPassword: this.defaultUserPassword(),
      contactEmail: newSanitizedUser.email,
    };

    await this.transporterService.sendSystemEmails(
      mailOptions,
      mailData,
      SystemTemplates.INVITE_NEW_USER_TEMPLATE,
    );
  }

  async sendNewPracticeMailToExistingUser({
    newUser,
    fullName,
    practiceEntity,
  }: {
    newUser: IUser;
    fullName: string;
    practiceEntity: IPractice;
  }): Promise<void> {
    const frontendBaseUrl: string = this.getFrontEndBaseUrl();

    const mailOptions: Mail.Options = {
      to: newUser.email,
      subject: 'Welcome to Practice Optimization Dashboard',
      text: '',
    };

    const mailData: NewUserMailData = {
      signUpLink: frontendBaseUrl + `/login`,
      practiceName: practiceEntity.name,
      fullName,
      defaultUserPassword: this.defaultUserPassword(),
      contactEmail: newUser.email,
    };

    await this.transporterService.sendSystemEmails(
      mailOptions,
      mailData,
      SystemTemplates.NEW_PRACTICE_MAIL_TO_EXISTING_USER,
    );
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['practices'],
    });
  }
  async getUserByPhoneNumber(
    contactNumber: string,
  ): Promise<UserEntity[] | null> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.practices', 'practices')
      .where('CONCAT(user.countryCode, user.contactNumber) = :contactNumber', {
        contactNumber,
      })
      .getMany();
  }

  async uploadUserImg({ id, practiceId, file }: UploadUserImgData) {
    const key: string = getUploadFileKey(UploadType.USER, {
      practiceId,
      userId: id,
      file,
    });

    const uploadImg = await this.s3Service.uploadFile(file, key);

    //@ts-expect-error only need to send url from here
    return this.updateUser(id, { imgUrl: uploadImg.Location });
  }
}
