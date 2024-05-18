import {
  CheckListOptions,
  EntityChanges,
  SelectedSurgeryOption,
  SurgeryEntity,
} from '@packages/entities';
import { UpdateSurgeryDto } from '../surgery/dto/updateSurgery.dto';

export const findChangedValues = (oldObj, newObj): EntityChanges => {
  const changedValues: Partial<EntityChanges> = {};

  const findChanges = (oldVal, newVal, path = '') => {
    if (typeof oldVal !== 'object' && typeof newVal !== 'object') {
      if (oldVal !== newVal) {
        console.log(oldVal, newVal, 'innotobj');
        changedValues[path] = { oldValue: oldVal, newValue: newVal };
      }
      return;
    }

    for (const key in newVal) {
      if (key === 'value') {
        if (oldVal === undefined) {
          changedValues[path] = { oldValue: oldVal, newValue: newVal[key] };
        } else if (oldVal[key] !== newVal[key]) {
          changedValues[path] = {
            oldValue: oldVal[key],
            newValue: newVal[key],
          };
        }
        return;
      } else {
        findChanges(oldVal[key], newVal[key], key);
      }
    }
  };

  findChanges(oldObj, newObj);

  return changedValues as EntityChanges;
};

export type ChangesKeyValues = {
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

export const transformSurgeryObject = (
  data: SurgeryEntity,
): ChangesKeyValues => {
  return {
    bodyPart: data.bodyPart,
    date: new Date(data.date),
    details: data.patient.details,
    firstName: data.patient.firstName,
    insuranceName: data.insuranceType.name,
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
): ChangesKeyValues => {
  return {
    bodyPart: data.bodyPart,
    date: new Date(data.date),
    details: data.details,
    firstName: data.firstName,
    // @ts-expect-error this will present in updatesurgerydto object
    insuranceName: data?.insuranceType?.name,
    lastName: data.lastName,
    mrn: data.mrn,
    // @ts-expect-error getting this as like selectedCheckListOption from frontend it should be selectedCheckListOptions
    selectedCheckListOptions: data.selectedCheckListOption,
    selectedSurgeryOptions: data.selectedSurgeryOptions,
    //@ts-expect-error types are not right in dto, but we are gettig these in body
    totalHospitalPricing: data.totalHospitalPricing,
    //@ts-expect-error types are not right in dto, but we are gettig these in body
    totalProfessionalPricing: data.totalProfessionalPricing,
  };
};
