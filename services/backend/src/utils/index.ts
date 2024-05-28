import { Between } from 'typeorm';

export function getStartEndDate(months: string[] = []) {
  const currentYear = new Date().getFullYear();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthMap: Record<string, number> = monthNames.reduce(
    (acc, month, index) => {
      acc[month] = index;
      return acc;
    },
    {} as Record<string, number>,
  );

  const invalidMonths = months.filter((month) => !(month in monthMap));
  if (invalidMonths.length > 0) {
    throw new Error(
      'Invalid month format. Expected array with valid month names.',
    );
  }

  const dateConditions = months.map((month) => {
    const monthIndex = monthMap[month];
    const startDate = new Date(currentYear, monthIndex, 1);
    const endDate = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59, 999);
    return { date: Between(startDate, endDate) };
  });

  return dateConditions;
}
