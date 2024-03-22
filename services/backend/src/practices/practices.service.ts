import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { PracticeEntity } from '../entities/practices.entity';
import { UserStatus } from '../enums/status.enum';
import { UserType } from '../enums/userType.enum';
import { UsersService } from '../users/users.service';
import { PracticeCreateDto } from './dto/create.dto';
import { PracticePatchDto } from './dto/patch.dto';

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(PracticeEntity)
    private practicesRepository: Repository<PracticeEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private dataSource: DataSource,
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
  async create({
    name,
    adminEmail,
    adminContactNumber,
    adminFirstName,
    adminLastName,
    physicianContactNumber,
    physicianEmail,
    code,
  }: PracticeCreateDto): Promise<PracticeEntity> {
    // initiating transaction as multiple table operations are in queue
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newPractice: PracticeEntity = new PracticeEntity();

      const practice = await this.practicesRepository.save({
        ...newPractice,
        name,
        code,
      });

      // creating admin user
      await this.userService.create(
        {
          firstName: adminFirstName,
          lastName: adminLastName,
          email: adminEmail,
          userName: `${adminEmail}`,
          status: UserStatus.ACTIVE,
          type: UserType.ADMIN,
          url: '',
          contactNumber: adminContactNumber,
        },
        practice.id,
      );

      // creating physician user
      await this.userService.create(
        {
          firstName: `${name}`,
          lastName: 'physician',
          email: physicianEmail,
          userName: `${physicianEmail}`,
          status: UserStatus.ACTIVE,
          type: UserType.PHYSICIAN,
          url: '',
          contactNumber: physicianContactNumber,
        },
        practice.id,
      );

      await queryRunner.commitTransaction();

      return practice;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
