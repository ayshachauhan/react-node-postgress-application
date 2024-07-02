import { IBaseEntity } from '../base.interface';
import { ISurgeryType } from '../surgeryType';

export interface ISurgeryConfiguration extends IBaseEntity {
  surgeryType: ISurgeryType;
  name: string;
  bodyPart: string[];
  facility: string[];
  options: SurgeryOptions;
  checkList: SurgeryChecklist;
  color: string;
  conditionalOptions: SurgeryConditionalOptions;
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
  billingType: string;
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
    edit_admin_option: boolean;
  };
};

export type SurgeryConditionalOptions = {
  [key: string]: {
    type: string;
    label: string;
    default: string;
    required: string;
    dependsUpon: string | null;
    dependencies?: DependantOption[];
    count: number;
    edit_admin_option: boolean;
  };
};

export type DependantOption = {
  [key: string]: string[];
};

export type UpdateSurgeryConfigPayload = {
  name: string;
  bodyPart: string[];
  facility: string[];
  options: SurgeryOptions;
  checkList: SurgeryChecklist;
  surgeryTypeId?: string;
};

export type CreateSurgeryConfigurationPayload = {
  name: string;
  bodyPart: string[];
  facility: string[];
  options: SurgeryOptions;
  checkList: SurgeryChecklist;
  surgeryTypeId: string;
  color: string;
};
