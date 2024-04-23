import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';

export interface ISurgeryType extends IBaseEntity {
  practice: IPractice;
  name: string;
}

/**
 * type defines checklist for a given surgery
 */
export type SurgeryChecklist = {
  [key: string]: {
    type: string;
    label: string;
    default: string;
    required: string;
  };
};

export type SurgeryOptions = {};
