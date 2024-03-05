import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './healthz/health.module';
import { ENVIRONMENT_VARIABLES } from './enums/environment.enums';
import { ENV_VARIABLES_SCHEMA } from './enums/env-validation';
import { PracticesModule } from './practices/practices.module';
import { PracticeHomesModule } from './practiceHomes/practiceHomes.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
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
    HealthModule,
    PracticesModule,
    PracticeHomesModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
