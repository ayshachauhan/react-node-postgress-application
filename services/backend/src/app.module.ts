import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { HealthModule } from './healthz/health.module';
import { ENVIRONMENT_VARIABLES } from './enums/environment.enums';
import { ENV_VARIABLES_SCHEMA } from './enums/env-validation';
import { PracticesModule } from './practices/practices.module';
import { PracticeHomesModule } from './practiceHomes/practiceHomes.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
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
      validationSchema: ENV_VARIABLES_SCHEMA,
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
    UsersModule,
    AuthModule,
    HealthModule,
    PracticesModule,
    PracticeHomesModule,
    MediaModule,
  ],
})
export class AppModule {}
