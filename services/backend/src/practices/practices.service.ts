import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeEntity } from 'src/entities/practices.entity';
import { UserStatus } from 'src/enums/status.enum';
import { UserType } from 'src/enums/userType.enum';
import { UsersService } from 'src/users/users.service';
import { Repository, UpdateResult } from 'typeorm';
import { PracticeCreateDto } from './dto/create.dto';
import { PracticePatchDto } from './dto/patch.dto';

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async findAll(): Promise<PracticeEntity[]> {
    return await this.practicesRepository.find();
  }

  async findOne(id: string): Promise<PracticeEntity | null> {
    return await this.practicesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.practicesRepository.softDelete(id);
  }

  async create({ name, email }: PracticeCreateDto): Promise<PracticeEntity> {
    const newPractice: PracticeEntity = new PracticeEntity();

    const practice = await this.practicesRepository.save({
      ...newPractice,
      name,
    });

    await this.userService.create(
      {
        firstName: 'admin',
        lastName: 'admin',
        email,
        userName: `${name}_${email}`,
        status: UserStatus.ACTIVE,
        type: UserType.ADMIN,
        url: '',
        contactNumber: '9876543210',
      },
      practice.id,
    );

    return practice;
  }

  async update(
    id: string,
    practicePatchDto: PracticePatchDto,
  ): Promise<PracticeEntity | null> {
    const updateResult: UpdateResult = await this.practicesRepository.update(
      id,
      practicePatchDto,
    );

    if (updateResult.affected === 0) {
      throw new HttpException(
        `Practice with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.practicesRepository.findOne({ where: { id } });
  }
}
