import { EntityChanges } from '@packages/entities/*';

export const findChangedValues = (oldObj, newObj): EntityChanges => {
  const changedValues: Partial<EntityChanges> = {};

  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      changedValues[key] = { oldValue: oldObj[key], newValue: newObj[key] };
    }
  }

  return changedValues as EntityChanges;
};
