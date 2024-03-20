import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { ENV_VALIDATIONS } from './enums/env-validation';
import { ENVIRONMENT_VARIABLES } from './enums/environment.enums';
import { HealthModule } from './healthz/health.module';
import { MediaModule } from './media/media.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PracticeHomesModule } from './practiceHomes/practiceHomes.module';
import { PracticesModule } from './practices/practices.module';
import { ReferrersModule } from './referrers/referrers.module';
import { TransporterModule } from './transporter';
import { UserPermissionsModule } from './userPermissions/userPermissions.module';
import { UserPracticesModule } from './userPractices/userPractices.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get(ENVIRONMENT_VARIABLES.JWT_SECRET_KEY),
          signOptions: {
            expiresIn: configService.get(ENVIRONMENT_VARIABLES.EXPIRES_IN),
          },
        };
      },
      inject: [ConfigService],
      extraProviders: [JwtService],
    }),
    LoggerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const nodeEnv: string =
          configService.get(ENVIRONMENT_VARIABLES.NODE_ENV) ?? 'production';
        return {
          pinoHttp: {
            level: 'debug',
            transport:
              nodeEnv !== 'production'
                ? { target: 'pino-pretty', options: { colorize: true } }
                : undefined,
          },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ENV_VALIDATIONS,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(ENVIRONMENT_VARIABLES.DB_HOST),
        port: configService.get(ENVIRONMENT_VARIABLES.DB_PORT),
        username: configService.get(ENVIRONMENT_VARIABLES.DB_USERNAME),
        password: configService.get(ENVIRONMENT_VARIABLES.DB_PASSWORD),
        database: configService.get(ENVIRONMENT_VARIABLES.DB_DATABASE),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    TransporterModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const host: string = configService.get(
          ENVIRONMENT_VARIABLES.SMTP_HOST,
        )!;
        const port: number = configService.get<number>(
          ENVIRONMENT_VARIABLES.SMTP_PORT,
        )!;

        const user: string = configService.get(
          ENVIRONMENT_VARIABLES.SMTP_EMAIL,
        )!;
        const pass: string = configService.get(
          ENVIRONMENT_VARIABLES.SMTP_PASSWORD,
        )!;
        return {
          host,
          port,
          user,
          pass,
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    HealthModule,
    PracticesModule,
    PracticeHomesModule,
    MediaModule,
    PermissionsModule,
    UserPermissionsModule,
    UserPracticesModule,
    ReferrersModule,
  ],
})
export class AppModule {}
