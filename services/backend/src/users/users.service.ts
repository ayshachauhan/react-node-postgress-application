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
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import { User } from 'src/entities/users.entity';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { PracticeStatus, UserStatus } from 'src/enums/status.enum';
import { UserType } from 'src/enums/userType.enum';
import { PracticesService } from 'src/practices/practices.service';
import { TransporterService } from 'src/transporter';
import { UserPracticesService } from 'src/userPractices/userPractices.services';
import { NewUserMailData, SanitizedUser } from 'src/users/types';
import { DataSource, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => PracticesService))
    private readonly practicesService: PracticesService,
    @Inject(forwardRef(() => UserPracticesService))
    private readonly userPracticeService: UserPracticesService,
    private readonly configService: ConfigService,
    private readonly transporterService: TransporterService,
    private jwtService: JwtService,
    private dataSource: DataSource,
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
  ): Promise<SanitizedUser> {
    const newUser: User = new User();
    const { firstName, lastName } = createUserDto;
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

      const resultUser = await this.usersRepository.save({
        ...newUser,
        ...createUserDto,
        fullName,
        password: hashedDefaultPassword,
      });

      const newSanitzedUser = this.sanitizeUser(resultUser);

      const token = this.jwtService.sign({
        ...newSanitzedUser,
      });

      // Read the HTML file content
      const htmlFilePath = path.join(
        __dirname,
        '../emailTemplates/inviteNewUserTemplate.html',
      );
      const htmlFileContent = fs.readFileSync(htmlFilePath, 'utf8');

      const mailOptions: Mail.Options = {
        to: resultUser.email,
        subject:
          'Subject: Welcome to Practice Optimization Dashboard - Complete Your Sign-up Process',
        html: htmlFileContent,
        text: 'text message',
      };

      const frontendBaseUrl: string = this.getFrontEndBaseUrl();

      const mailData: NewUserMailData = {
        signUpLink: frontendBaseUrl + `/onboarding/user?${token}`,
        practiceName: practiceEntity.name,
        fullName,
        defaultUserPassword: this.defaultUserPassword(),
      };

      await this.transporterService.sendEmail(mailOptions, mailData);

      await this.userPracticeService.create({
        userId: resultUser.id,
        practiceId,
      });

      await queryRunner.commitTransaction();
      return this.sanitizeUser(resultUser);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    return existingUser ? existingUser : null;
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async getUsersByPractice(practiceId: string): Promise<User[]> {
    await this.practicesService.findOne(practiceId);

    const usersByPractice =
      await this.userPracticeService.getUsersByPractice(practiceId);

    return await this.usersRepository.find({
      where: { id: In(usersByPractice.map((ele) => ele.user?.id)) },
    });
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

    const updatedResult = await this.usersRepository.update(id, {
      ...updateUserDto,
    });

    if (updatedResult.affected === 0) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const resultUser = await this.getUserById(id);
    if (resultUser) {
      return this.sanitizeUser(resultUser);
    }
    return null;
  }

  sanitizeUser(user: User): SanitizedUser {
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
}
