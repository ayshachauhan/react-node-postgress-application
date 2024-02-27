import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PracticeEntity } from "./practices.entity";
import { PatchDto } from "./dto/patch.dto";
import { CreateDto } from "./dto/create.dto";

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>
  ) {}

  async findAll(): Promise<PracticeEntity[]> {
    return this.practicesRepository.find();
  }

  async findOne(id: string): Promise<PracticeEntity | null> {
    return this.practicesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<string> {
    await this.practicesRepository.softDelete(id);
    return "Practice deleted successfully";
  }

  async create(createDto: CreateDto): Promise<string> {
    return "User created";
  }

  async update(id: string, patchDto: PatchDto): Promise<string> {
    console.log(id, patchDto);
    await this.practicesRepository.update(id, patchDto);
    return "User updated";
  }
}
