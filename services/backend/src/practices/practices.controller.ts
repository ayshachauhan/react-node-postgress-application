import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
} from "@nestjs/common";
import { PracticesService } from "./practices.service";
import { PracticeEntity } from "../entities/practices.entity";
import { PracticePatchDto } from "./dto/patch.dto";
import { PracticeCreateDto } from "./dto/create.dto";

@Controller("practices")
export class PracticesController {
  constructor(private readonly practiceService: PracticesService) {}

  @Get()
  async findAll(): Promise<PracticeEntity[]> {
    return this.practiceService.findAll();
  }

  @Get(":id")
  async findOne(@Param() params: any): Promise<PracticeEntity | null> {
    return this.practiceService.findOne(params.id);
  }

  @Delete(":id")
  async remove(@Param() params: any): Promise<string> {
    return this.practiceService.remove(params.id);
  }

  @Post()
  async create(@Body() practiceCreateDto: PracticeCreateDto): Promise<String> {
    return this.practiceService.create(practiceCreateDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() practicePatchDto: PracticePatchDto
  ): Promise<String> {
    return this.practiceService.update(id, practicePatchDto);
  }
}
