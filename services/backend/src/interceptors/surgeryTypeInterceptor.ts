import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SurgeryTypesService } from 'src/surgeryTypes/surgeryTypes.service';

@Injectable()
export class surgeryTypeNotFoundInterceptor<T>
  implements NestInterceptor<T | T[], T | T[]>
{
  constructor(private readonly surgeryTypeService: SurgeryTypesService) {}

  async intercept(
    context: ExecutionContext,
    next,
  ): Promise<Observable<T | T[]>> {
    const request = context.switchToHttp().getRequest();
    const practiceId: string = request.params.practiceId;
    const surgeryTypeId: string = request.params.surgeryTypeId;
    const surgeryTypeEntity = await this.surgeryTypeService.getSurgeryTypeById(
      surgeryTypeId,
      practiceId,
    );
    if (!surgeryTypeEntity) {
      throw new NotFoundException('SurgeryType not found');
    }
    request.surgeryTypeEntity = surgeryTypeEntity;
    return next.handle();
  }
}
