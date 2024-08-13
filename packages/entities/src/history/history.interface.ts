import { IBaseEntity } from '../base.interface';
import { IEval } from '../eval/eval.interface';
import { IPractice } from '../practice/practice.interface';
import { ISurgery } from '../surgery/surgery.interface';
import { ISanitizedUser } from '../user/user.interface';

export enum HistoryAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum HistoryType {
  SURGERY = 'surgery',
  EVAL = 'eval',
}

export type ChangedValue = {
  oldValue: string;
  newValue: string;
};

export type EntityChanges = Record<keyof ISurgery | keyof IEval, ChangedValue>;

export interface IHistory extends IBaseEntity {
  practice: IPractice;
  user: ISanitizedUser;
  entityType: HistoryType;
  action: HistoryAction;
  entityId: string;
  changes?: EntityChanges;
  ipAddress?: string;
  entityData?: ISurgery | IEval | {};
}
