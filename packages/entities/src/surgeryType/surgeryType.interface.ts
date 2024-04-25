import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';

export interface ISurgeryType extends IBaseEntity {
  practice: IPractice;
  name: string;
  bodyPart: string[];
  facility: string[];
  options: SurgeryOptions;
  checkList: SurgeryChecklist;
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

/**
 * surgery option list
 */
export type SurgeryOptionAllowedList = {
  // name for the option
  name: string;
  // professional pricing for the option
  professionalPricing: number;
  // hospital pricing for the option
  hospitalPricing: number;
};

/**
 * surgery options
 */
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
