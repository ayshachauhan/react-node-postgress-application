import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${__dirname}/../../../.env`
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async () => {
              return {
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.PORT) || 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_DATABASE || 'postgres',
                autoLoadEntities: true,
                synchronize: true,
              };
            },
          }),
        UsersModule,
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
