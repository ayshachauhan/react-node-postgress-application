import { ModuleMetadata } from '@nestjs/common/interfaces';

export const EMAIL_MODULE_OPTIONS = 'EMAIL_MODULE_OPTIONS';
export const EMAIL_CONNECTION_TOKEN = 'EMAIL_CONNECTION_TOKEN';

export type ModuleOptions = {
  host: string;
  port: number;
  user: string;
  pass: string;
};

/**
 * async module options for beethoven global module
 */

export interface AsyncModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  // eslint-disable-next-line
  useFactory: (...args: any[]) => ModuleOptions | Promise<ModuleOptions>;
  // eslint-disable-next-line
  inject?: any[];
  // eslint-disable-next-line
  imports?: any[];
}

export enum SystemTemplates {
  INVITE_NEW_USER_TEMPLATE = 'inviteNewUserTemplate',
  ADMIN_INVITE = 'adminInvite',
  NEW_PRACTICE_MAIL_TO_EXISTING_USER = 'newPracticeMailToExistingUser',
  NOTIFY_PATIENT = 'notifyPatient',
  NOTIFY_DOCTOR = 'notifyDoctor',
  REVIEW_REQUEST = 'reviewRequest',
  RESET_PASSWORD = 'resetPassword',
  SEND_VIDEO_TO_PATIENT = 'sendVideoToPatient',
  NOTIFY_STAFF_EVAL_BOOKED = 'notifyStaffEvalBooked',
  NOTIFY_STAFF_SURGERY_BOOKED = 'notifyStaffSurgeryBooked',
  NOTIFY_STAFF_SURGERY_UPDATED = 'notifyStaffSurgeryUpdated',
  NOTIFY_REFERRER = 'notifyReferrer',
}
