import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { UsersService } from '../users/users.service';
import { SanitizedUser, SuperAdminUser } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<SanitizedUser | SuperAdminUser | null> {
    const superAdmin = await this.checkSuperAdmin(email, password);

    if (superAdmin) return superAdmin;
    else {
      const user = await this.usersService.findUserByEmail(email);

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

  async setUserPractices(payloadUser): Promise<void> {
    const user = await this.usersService.getUserById(payloadUser.id);
    payloadUser['userPractices'] = user?.practices;
  }
}
