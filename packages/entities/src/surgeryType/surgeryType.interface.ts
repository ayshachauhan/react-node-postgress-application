import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';

export interface ISurgeryType extends IBaseEntity {
  practice: IPractice;
  name: string;
  bodyPart: string[];
  facility: string[];
  options: SurgeryOptions;
  checkList: SurgeryChecklist;
  type: string;
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
    allowedValues: SurgeryOptionAllowedList[];
    count: number;
  };
};

export interface IAddFacility {
  id: string;
  name: string;
}

export type AddFacility = {
  practiceId: string;
  id: string;
  name: string;
};

export interface IBodyPart {
  id: string;
  name: string;
}

export type BodyPart = {
  practiceId: string;
  id: string;
  name: string;
};
