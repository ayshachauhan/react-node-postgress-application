import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@packages/entities/*';
import * as bcrypt from 'bcrypt';
import Mail from 'nodemailer/lib/mailer';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { TransporterService } from '../transporter/transporter.service';
import { SystemTemplates } from '../transporter/transporter.types';
import { UsersService } from '../users/users.service';
import { SanitizedUser, SuperAdminUser } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly transporterService: TransporterService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<SanitizedUser | SuperAdminUser | null> {
    const superAdmin = await this.checkSuperAdmin(email, password);

    if (superAdmin) return superAdmin;
    else {
      const user = await this.usersService.findUserByEmail(email);
      if (user && user.status !== 'active') {
        throw new UnauthorizedException(
          'Please accept the invitation and reset your password using the link in email.',
        );
      }

      if (user) {
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (isPasswordMatched) {
          const { password, ...result } = user;
          password && password;
          return {
            ...result,
            isSuperAdmin: false,
          };
        } else return null;
      } else return null;
    }
  }

  async login(user: SanitizedUser | SuperAdminUser) {
    return {
      access_token: this.jwtService.sign(user),
      is_super_admin: user.isSuperAdmin,
    };
  }

  async loginUsingEmail(email: string): Promise<SanitizedUser> {
    const user = await this.usersService.findUserByEmail(email);

    if (user && user.status !== 'active') {
      throw new UnauthorizedException(
        'Please accept the invitation and reset your password using the link in email.',
      );
    }

    if (user) {
      const { password, ...result } = user;
      password && password;
      return {
        ...result,
        isSuperAdmin: false,
      };
    }

    throw new ForbiddenException();
  }

  async checkSuperAdmin(
    email: string,
    password: string,
  ): Promise<SuperAdminUser | null> {
    const superAdminEmail = await this.configService.get(
      ENVIRONMENT_VARIABLES.SUPER_ADMIN_EMAIL,
    );
    const superAdminPassword = await this.configService.get(
      ENVIRONMENT_VARIABLES.SUPER_ADMIN_PASSWORD,
    );
    if (email == superAdminEmail) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        superAdminPassword,
      );

      if (isPasswordMatched) {
        return { email, isSuperAdmin: true };
      } else return null;
    }
    return null;
  }

  async setUserDetails(payloadUser: SanitizedUser): Promise<UserEntity | null> {
    const userData = await this.usersService.getUserById(payloadUser.id);

    if (userData) {
      payloadUser['practices'] = userData?.practices;
      payloadUser['permissions'] = userData?.permissions;
    }
    return userData;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    if (!email) {
      throw new HttpException(
        'Email cannot be empty',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'User email is not registered with us! Please enter registered email.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const token: string = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        type: user.type,
        status: user.status,
        fullName: user.fullName,
      },
      { expiresIn: '15m' },
    );

    const mailOptions: Mail.Options = {
      to: user.email,
      subject: 'POD: Reset Your Password',
    };

    const frontendBaseUrl: string | undefined = this.configService.get(
      ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL,
    );

    const mailData = {
      resetLink: frontendBaseUrl + `/resetpassword?token=${token}`,
      userFirstName: user.firstName,
      userLastName: user.lastName,
    };

    await this.transporterService.sendSystemEmails(
      mailOptions,
      mailData,
      SystemTemplates.RESET_PASSWORD,
    );
  }
}
