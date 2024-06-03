import { IBaseEntity } from '../base.interface';

export interface IPermission extends IBaseEntity {
  name: string;
}

export enum USER_PERMISSIONS {
  VIEW_FUTURE_CASES = 'view_future_cases',
  VIEW_PAST_CASES = 'view_past_cases',
  VIEW_BILLING = 'view_billing',
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_REP = 'view_rep',
  VIEW_MSG = 'view_msg',
  VIEW_HX = 'view_hx',
  VIEW_NURTURE = 'view_nurture',
  VIEW_REFERRERS = 'view_referrers',
  VIEW_TEMPLATES = 'view_templates',
  VIEW_VIDEOS = 'view_videos',
  ADD_CASE = 'add_case',
  EDIT_CASE = 'edit_case',
  EDIT_CALENDAR = 'edit_calendar',
  EDIT_TEMPLATES = 'edit_templates',
  DELETE_CASE = 'delete_case',
  LEADERBOARD_DISPLAY = 'leaderboard_display',
}
