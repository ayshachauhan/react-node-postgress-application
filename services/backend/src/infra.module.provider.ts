import { DynamicModule, ForwardReference } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CalendarEntity,
  EmailLogEntity,
  EvalEmailEntity,
  EvalEntity,
  HistoryEntity,
  InsuranceTypeEntity,
  MediaConfigEntity,
  MediaEntity,
  PatientEntity,
  PermissionEntity,
  PracticeEntity,
  PracticeHomesEntity,
  ReferrersEntity,
  ReviewEntity,
  SurgeryConfigurationEntity,
  SurgeryEmailEntity,
  SurgeryEntity,
  SurgeryTypeEntity,
  TemplateEntity,
  UserEntity,
  WaitlistEntity,
} from '@packages/entities';
import { LoggerModule } from 'nestjs-pino';
import { ENV_VALIDATIONS } from './enums/env-validation';
import { ENVIRONMENT_VARIABLES } from './enums/environment.enums';
import { TransporterModule } from './transporter';
import { TypeOrmLogger } from './typeorm.logger';

/**
 * All the imports related to infrastructure should be added here
 * @returns
 */
export const createInfraModuleProviders = (): Array<
  DynamicModule | Promise<DynamicModule> | ForwardReference
> => {
  return [
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
          pinoHttp:
            nodeEnv === 'production'
              ? {
                  level: 'debug',
                  transport:
                    nodeEnv !== 'production'
                      ? { target: 'pino-pretty', options: { colorize: true } }
                      : undefined,
                }
              : {},
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
        entities: [
          InsuranceTypeEntity,
          MediaEntity,
          PermissionEntity,
          PracticeEntity,
          PracticeHomesEntity,
          ReferrersEntity,
          SurgeryTypeEntity,
          TemplateEntity,
          UserEntity,
          CalendarEntity,
          SurgeryEntity,
          PatientEntity,
          EvalEntity,
          ReviewEntity,
          SurgeryConfigurationEntity,
          HistoryEntity,
          EmailLogEntity,
          EvalEmailEntity,
          SurgeryEmailEntity,
          WaitlistEntity,
          MediaConfigEntity,
        ],
        logging: 'all',
        logger: new TypeOrmLogger(),
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
  ];
};
