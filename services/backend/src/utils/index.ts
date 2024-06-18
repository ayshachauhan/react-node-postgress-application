import { PermissionEntity } from '@packages/entities/*';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { Between } from 'typeorm';

const currentYear = new Date().getFullYear();
const currentDate = new Date();

export function getStartEndDate(
  months: string[] = [],
  userPermissions: PermissionEntity[],
) {
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

  const hasViewPastCasesPermission = userPermissions.some(
    (permission) => permission.name === USER_PERMISSIONS.VIEW_PAST_CASES,
  );
  const hasViewFutureCasesPermission = userPermissions.some(
    (permission) => permission.name === USER_PERMISSIONS.VIEW_FUTURE_CASES,
  );

  const invalidMonths = months.filter((month) => !(month in monthMap));
  if (invalidMonths.length > 0) {
    throw new Error(
      'Invalid month format. Expected array with valid month names.',
    );
  }

  const dateConditions = months.map((month) => {
    const monthIndex = monthMap[month];
    let startDate = new Date(currentYear, monthIndex, 1);
    let endDate = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59, 999);

    if (monthIndex === currentDate.getMonth() && userPermissions.length) {
      const startOfDay = new Date(currentDate).setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate).setHours(23, 59, 59, 999);

      if (!hasViewPastCasesPermission && !hasViewFutureCasesPermission) {
        // User cannot view past or future cases, show only today’s records
        startDate = new Date(startOfDay);
        endDate = new Date(endOfDay);
      } else if (!hasViewPastCasesPermission) {
        // User cannot view past cases, start from tomorrow
        startDate = new Date(endOfDay);
        startDate.setDate(startDate.getDate() + 1);
      } else if (!hasViewFutureCasesPermission) {
        // User cannot view future cases, end at the end of today
        endDate = new Date(startOfDay);
      }
    }

    return { date: Between(startDate, endDate) };
  });

  return dateConditions;
}

export function getFullYearDateConditions(userPermissions: PermissionEntity[]) {
  const hasViewPastCasesPermission = userPermissions.some(
    (permission) => permission.name === USER_PERMISSIONS.VIEW_PAST_CASES,
  );
  const hasViewFutureCasesPermission = userPermissions.some(
    (permission) => permission.name === USER_PERMISSIONS.VIEW_FUTURE_CASES,
  );

  let startDate = new Date(currentYear, 0, 1);

  let endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);
  if (userPermissions.length) {
    if (!hasViewPastCasesPermission) {
      startDate = currentDate;
    }

    if (!hasViewFutureCasesPermission) {
      endDate = currentDate;
    }
  }

  return [{ date: Between(startDate, endDate) }];
}

export function formatHeaderDate(dateString: string) {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  const finalDate = formattedDate.replace(/(?<=^\w+),/, '');
  return finalDate;
}

export const toLowerCase = (str: string): string => {
  if (str) {
    return String(str).toLowerCase();
  } else return str;
};

export const toPascalCase = (str: string): string => {
  if (str) {
    return str
      .split(' ') // Split the string by spaces, underscores, or hyphens
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter and make the rest lowercase
      .join('');
  } else return str;
};
