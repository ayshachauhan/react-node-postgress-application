import { IBaseEntity } from '../base.interface';

export enum HistoryAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum HistoryType {
  SURGERY = 'surgery',
  EVAL = 'eval',
}

export interface IHistory extends IBaseEntity {
  entityType: HistoryType;
  action: HistoryAction;
  entityId: string;
  changes?: Record<string, unknown>;
}
