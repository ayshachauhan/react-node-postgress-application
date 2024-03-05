import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { UsersController } from './users.controller';
import { User } from '../entities/users.entity';
import { UsersService } from './users.service';
import { PracticesModule } from 'src/practices/practices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get(ENVIRONMENT_VARIABLES.JWT_SECRET_KEY),
        signOptions: configService.get(ENVIRONMENT_VARIABLES.EXPIRES_IN),
      }),
      inject: [ConfigService],
    }),
    PracticesModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
