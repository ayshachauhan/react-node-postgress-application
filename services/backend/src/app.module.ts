import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { HealthModule } from "./modules/healthz/health.module";
import { CustomConfigService } from "./config.service";
import { EnvironmentVariable } from "./enums/environment.enums";
import { envVariablesSchema } from "./env-validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envVariablesSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: CustomConfigService) => ({
        type: "postgres",
        host: configService.get(EnvironmentVariable.DB_HOST),
        port: configService.get(EnvironmentVariable.DB_PORT),
        username: configService.get(EnvironmentVariable.DB_USERNAME),
        password: configService.get(EnvironmentVariable.DB_PASSWORD),
        database: configService.get(EnvironmentVariable.DB_DATABASE),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
