import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const superAdmin = await this.checkSuperAdmin(email, password);

    if (superAdmin) return superAdmin;
    else {
      const user = await this.usersService.findUserByEmail(email);

      if (user) {
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (isPasswordMatched) {
          const { password: _password, ...result } = user;
          return result;
        } else return null;
      } else return null;
    }
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  async checkSuperAdmin(email: string, password: string): Promise<any> {
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
        return { email };
      } else return null;
    }
    return null;
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
