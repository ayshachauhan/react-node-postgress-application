import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPracticeEntity } from 'src/entities/userPractices.entity';
import { PracticesService } from 'src/practices/practices.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserPracticesService {
  constructor(
    @InjectRepository(UserPracticeEntity)
    private userPracticeRepository: Repository<UserPracticeEntity>,
    @Inject(forwardRef(() => PracticesService))
    private readonly practiceService: PracticesService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async remove(id: string): Promise<void> {
    await this.userPracticeRepository.softDelete(id);
  }

  async create({ userId, practiceId }): Promise<UserPracticeEntity> {
    const newUserPractice: UserPracticeEntity = new UserPracticeEntity();

    const practiceEntity = await this.practiceService.findOne(practiceId);
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }

    const userEntity = await this.userService.getUserById(userId);
    if (!userEntity) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return await this.userPracticeRepository.save({
      ...newUserPractice,
      practice: practiceEntity,
      user: userEntity,
    });
  }

  async update({ id, userId, practiceId }): Promise<UserPracticeEntity | null> {
    const userEntity = await this.userService.getUserById(userId);
    if (!userEntity) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const practiceEntity = await this.practiceService.findOne(practiceId);
    if (!practiceEntity) {
      throw new HttpException('practice not found', HttpStatus.NOT_FOUND);
    }

    await this.userPracticeRepository.update(id, {
      user: { id: userId },
      practice: { id: practiceId },
    });

    return await this.userPracticeRepository.findOne({
      where: { id, user: { id: userId }, practice: { id: practiceId } },
    });
  }

  async getUsersByPractice(practiceId: string): Promise<UserPracticeEntity[]> {
    return this.userPracticeRepository.find({
      where: { practice: { id: practiceId } },
    });
  }

  async getPracticesByUser(userId: string): Promise<UserPracticeEntity[]> {
    return await this.userPracticeRepository.find({
      where: { user: { id: userId } },
      relations: ['practice'],
    });
  }
}
