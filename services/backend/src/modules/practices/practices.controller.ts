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
import { PracticeEntity } from "./practices.entity";
import { PatchDto } from "./dto/patch.dto";
import { CreateDto } from "./dto/create.dto";

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
  async create(@Body() createDto: CreateDto): Promise<String> {
    return this.practiceService.create(createDto);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() patchDto: PatchDto
  ): Promise<String> {
    return this.practiceService.update(id, patchDto);
  }
}
