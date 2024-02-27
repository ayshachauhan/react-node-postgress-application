import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PracticesController } from "./practices.controller";
import { PracticeEntity } from "./practices.entity";
import { PracticesService } from "./practices.service";

@Module({
  imports: [TypeOrmModule.forFeature([PracticeEntity])],
  providers: [PracticesService],
  controllers: [PracticesController],
})
export class PracticesModule {}
