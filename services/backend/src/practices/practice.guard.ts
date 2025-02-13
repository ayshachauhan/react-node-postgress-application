import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CalendarService } from 'src/calendar/calendar.service';
import { EvalsService } from 'src/evals/evals.service';
import { MediaService } from 'src/media/media.service';
import { SurgeryService } from 'src/surgery/surgery.service';
import { TemplatesService } from 'src/templates/templates.service';
import { RequestWithUser } from '../auth/auth.guard';
import { HistoryService } from '../history/history.service';
import { InsuranceTypesService } from '../insuranceTypes/insuranceTypes.service';
import { PracticeHomesService } from '../practiceHomes/practiceHomes.service';
import { UsersService } from '../users/users.service';
@Injectable()
export class PracticeGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService, // ✅ Use forwardRef
    @Inject(forwardRef(() => EvalsService))
    private readonly evalsService: EvalsService,
    @Inject(forwardRef(() => SurgeryService))
    private readonly surgeryService: SurgeryService,
    @Inject(forwardRef(() => CalendarService))
    private readonly calendarService: CalendarService,
    @Inject(forwardRef(() => TemplatesService))
    private readonly templatesService: TemplatesService,
    @Inject(forwardRef(() => HistoryService))
    private readonly historyService: HistoryService,
    @Inject(forwardRef(() => InsuranceTypesService))
    private readonly insuranceTypesService: InsuranceTypesService,
    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService,
    @Inject(forwardRef(() => PracticeHomesService))
    private readonly practiceHomesService: PracticeHomesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const currentUser = request.user;
    const { practiceId, id, userId } = request.params;
    const path = request.route.path;

    if (!currentUser) {
      throw new ForbiddenException('User not authenticated.');
    }

    const currentUserDetails = await this.usersService.getUserById(
      currentUser.id,
    );

    if (!currentUserDetails || !currentUserDetails.practices) {
      throw new ForbiddenException('User has no associated practices.');
    }

    const isAuthorizedPractice = currentUserDetails.practices.some(
      (practice) => practice.id === practiceId,
    );

    if (!isAuthorizedPractice) {
      throw new ForbiddenException(
        'You do not have permission to do any action in this practice.',
      );
    }

    if (!id) {
      return true;
    }

    let entity;
    if (path.includes('evals')) {
      entity = await this.evalsService.getEvalById(id);
    } else if (path.includes('history')) {
      entity = await this.historyService.getHistoryById({ practiceId, id });
    } else if (path.includes('surgery')) {
      entity = await this.surgeryService.getSurgeryById(id);
    } else if (path.includes('calendar')) {
      entity = await this.calendarService.getCalendarById({
        practiceId,
        userId,
        id,
      });
    } else if (path.includes('templates')) {
      entity = await this.templatesService.getTemplateById(id);
    } else if (path.includes('mediaconfig')) {
      entity = await this.mediaService.getMediaByMediaConfigId(practiceId, id);
    } else if (path.includes('media')) {
      entity = await this.mediaService.getMediaById(practiceId, id);
    } else if (path.includes('homes')) {
      entity = await this.practiceHomesService.getPracticeHomeById(
        id,
        practiceId,
      );
    } else if (path.includes('insurance-types')) {
      entity = await this.insuranceTypesService.getInsuranceTypeById(
        id,
        practiceId,
      );
    } else if (path.includes('users')) {
      entity = await this.usersService.getUserById(id);
    } else {
      throw new NotFoundException('Invalid entity type.');
    }

    if (!entity) {
      throw new NotFoundException('Entity not found.');
    }

    if (path.includes('users') && !path.includes('template')) {
      const targetUserPracticeIds = entity.practices.map((p) => p.id);
      if (!targetUserPracticeIds.includes(practiceId)) {
        throw new ForbiddenException(
          'You do not have permission to modify this user.',
        );
      }
    } else if (path.includes('media')) {
      if (entity.practiceId !== practiceId) {
        throw new ForbiddenException(
          'You do not have permission to access this entity.',
        );
      }
    } else {
      if (entity.practice.id !== practiceId) {
        throw new ForbiddenException(
          'You do not have permission to access this entity.',
        );
      }
    }

    return true;
  }
}
