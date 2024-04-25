import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PracticesService } from '../practices/practices.service';

@Injectable()
export class PracticeNotFoundInterceptor<T>
  implements NestInterceptor<T | T[], T | T[]>
{
  constructor(private readonly practicesService: PracticesService) {}

  async intercept(
    context: ExecutionContext,
    next,
  ): Promise<Observable<T | T[]>> {
    const request = context.switchToHttp().getRequest();
    const practiceId = request.params.practiceId;
    const practiceEntity = await this.practicesService.findOne(practiceId);
    if (!practiceEntity) {
      throw new NotFoundException('Practice not found');
    }
    request.practiceEntity = practiceEntity;
    return next.handle();
  }
}
