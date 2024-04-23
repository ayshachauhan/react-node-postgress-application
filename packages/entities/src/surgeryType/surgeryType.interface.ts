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

export type SurgeryOptionAllowedList = {
  name: string;
  professionalPricing: number;
  hospitalPricing: number;
};

export type SurgeryOptions = {
  [key: string]: {
    type: string;
    label: string;
    default: string;
    required: string;
    allowedValues: [];
    count: number;
  };
};
