import {
  CheckListOptions,
  EntityChanges,
  EvalEntity,
  SelectedSurgeryOption,
  SurgeryEntity,
} from '@packages/entities';
import { UpdateEvalDto } from 'src/evals/dto/updateEval.dto';
import { UpdateSurgeryDto } from '../surgery/dto/updateSurgery.dto';

/**
 * @param oldObj Current Object
 * @param newObj New Object with updated values
 * @returns Changes key with their values in both object by comparing the values upto one nested level object
 */
export const findChangedValues = (oldObj, newObj): EntityChanges => {
  const changedValues: Partial<EntityChanges> = {};

  const findChanges = (oldVal, newVal, path = '') => {
    if (typeof oldVal !== 'object' && typeof newVal !== 'object') {
      if (oldVal !== newVal) {
        changedValues[path] = { oldValue: oldVal, newValue: newVal };
      }
      return;
    }

    for (const key in newVal) {
      if (key === 'value') {
        if (oldVal === undefined || oldVal === null) {
          changedValues[path] = { oldValue: oldVal, newValue: newVal[key] };
        } else if (newVal === undefined || newVal === null) {
          changedValues[path] = { oldValue: oldVal[key], newValue: newVal };
        } else if (oldVal[key] !== newVal[key]) {
          changedValues[path] = {
            oldValue: oldVal[key],
            newValue: newVal[key],
          };
        }
        return;
      } else {
        const oldObjVal = oldVal ? oldVal[key] : oldVal;
        const newObjVal = newVal ? newVal[key] : newVal;
        findChanges(oldObjVal, newObjVal, key);
      }
    }
  };

  findChanges(oldObj, newObj);

  return changedValues as EntityChanges;
};

export type SurgeryChangesKeyValues = {
  bodyPart: string;
  date: Date;
  details: string;
  firstName: string;
  lastName: string;
  mrn: number;
  selectedCheckListOptions: CheckListOptions;
  selectedSurgeryOptions: SelectedSurgeryOption;
  totalHospitalPricing: number;
  totalProfessionalPricing: number;
  insuranceName: string;
};

export type EvalChangesKeyValues = {
  bodyPart: string;
  date: Date;
  details: string;
  firstName: string;
  lastName: string;
  mrn: number;
  status: string;
  insuranceName: string;
};

export const transformSurgeryObject = (
  data: SurgeryEntity,
): SurgeryChangesKeyValues => {
  return {
    bodyPart: data.bodyPart,
    date: new Date(data.date),
    details: data.patient.details,
    firstName: data.patient.firstName,
    insuranceName: data?.insuranceType?.name,
    lastName: data.patient.lastName,
    mrn: data.patient.mrn,
    selectedCheckListOptions: data.selectedCheckListOptions,
    selectedSurgeryOptions: data.selectedSurgeryOptions,
    totalHospitalPricing: data.totalHospitalPricing,
    totalProfessionalPricing: data.totalProfessionalPricing,
  };
};

export const transformUpdateSurgeryDTO = (
  data: UpdateSurgeryDto,
): SurgeryChangesKeyValues => {
  return {
    bodyPart: data.bodyPart,
    date: new Date(data.date),
    details: data.details,
    firstName: data.firstName,
    // @ts-expect-error this will present in updatesurgerydto object
    insuranceName: data?.insuranceType?.name,
    lastName: data.lastName,
    mrn: data.mrn,
    selectedCheckListOptions: data.selectedCheckListOptions,
    selectedSurgeryOptions: data.selectedSurgeryOptions,
    totalHospitalPricing: data.totalHospitalPricing,
    totalProfessionalPricing: data.totalProfessionalPricing,
  };
};

/**
 *
 * @param data
 * @returns transformed udpateeval dto for finding changed values
 */
export const transformUpdateEvalDTO = (
  data: UpdateEvalDto & { insuranceName: string },
): EvalChangesKeyValues => {
  return {
    bodyPart: data.bodyPart,
    date: new Date(data.date),
    details: data.details,
    firstName: data.firstName,
    insuranceName: data?.insuranceName,
    lastName: data.lastName,
    mrn: data.mrn,
    status: data.status,
  };
};

/**
 *
 * @param data
 * @returns transformed eval entity object to find changed values
 */
export const transformEvalObject = (data: EvalEntity): EvalChangesKeyValues => {
  return {
    bodyPart: data.bodyPart,
    date: new Date(data.date),
    details: data.patient.details,
    firstName: data.patient.firstName,
    insuranceName: data?.insuranceType?.name,
    lastName: data.patient.lastName,
    mrn: data.patient.mrn,
    status: data.status,
  };
};
