export const findChangedValues = <T>(
  oldObj: T,
  newObj: T,
): Partial<Record<keyof T, { old: T[keyof T]; new: T[keyof T] }>> => {
  const changedValues: Partial<
    Record<keyof T, { old: T[keyof T]; new: T[keyof T] }>
  > = {};

  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      changedValues[key] = { old: oldObj[key], new: newObj[key] };
    }
  }

  return changedValues;
};
