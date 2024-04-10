import {
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PracticesService } from 'src/practices/practices.service';

@Injectable()
export class practiceNotFoundInterceptor<T>
  implements NestInterceptor<T | T[], T | T[]>
{
  constructor(
    private readonly practicesService: PracticesService,
    @Inject('NOT_FOUND_MESSAGE') private readonly errorMessage: string,
  ) {}

  async intercept(
    context: ExecutionContext,
    next,
  ): Promise<Observable<T | T[]>> {
    const request = context.switchToHttp().getRequest();
    const practiceId = request.params.practiceId;
    const practiceEntity = await this.practicesService.findOne(practiceId);
    if (!practiceEntity) {
      throw new NotFoundException(this.errorMessage);
    }

    return next.handle();
  }
}
