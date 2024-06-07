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
    createFromUserController: boolean,
  ): Promise<SanitizedUser> {
    const { firstName, lastName } = createUserDto;
    const { permissionIds } = createUserDto;
    const fullName = `${firstName}_${lastName}`;
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
        newUser = await this.usersRepository.save({
          ...newUser,
          ...createUserDto,
          fullName,
          password: hashedDefaultPassword,
          practices: [practiceEntity],
          permissions: permissionEntities || [],
        });

        if (createFromUserController) {
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

        newUser = existingUser;
        if (createFromUserController) {
          await this.sendNewPracticeMailToExistingUser({
            newUser,
            fullName,
            practiceEntity,
          });
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
      relations: ['practices', 'permissions', 'surgeries'],
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

    await this.usersRepository.softDelete(id);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SanitizedUser | null> {
    const userToUpdate = await this.getUserById(id);
    if (!userToUpdate) {
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

    const savedUser = await this.usersRepository.save(updatedUser);

    if (savedUser) {
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
    const { email, newPassword, confirmPassword, oldPassword } =
      changePasswordDto;
    if (confirmPassword !== newPassword) {
      throw new HttpException(
        'Password does not match',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const user = await this.findUserByEmail(email);
    if (user) {
      const isPasswordMatched = await bcrypt.compare(
        oldPassword,
        user.password,
      );
      if (isPasswordMatched) {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedResult = await this.usersRepository.update(user.id, {
          password: newHashedPassword,
          status: UserStatus.ACTIVE,
        });

        // if admin is changing password and the password is default. then setting practice status as active
        if (
          user.type == UserType.ADMIN &&
          oldPassword == this.defaultUserPassword()
        ) {
          await this.practicesService.update(practiceId, {
            status: PracticeStatus.ACTIVE,
          });
        }

        if (updatedResult.affected === 0) {
          throw new HttpException(
            `error while updating`,
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        const resultUser = await this.getUserById(user.id);
        if (resultUser) {
          return this.sanitizeUser(resultUser);
        }
      }
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
    const newSanitizedUser = this.sanitizeUser(newUser);
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
      text: 'text message',
    };

    const mailData: NewUserMailData = {
      signUpLink: frontendBaseUrl + `/login`,
      practiceName: practiceEntity.name,
      fullName,
      defaultUserPassword: this.defaultUserPassword(),
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
