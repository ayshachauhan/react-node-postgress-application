import { PermissionEntity } from '@packages/entities/*';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { Between } from 'typeorm';

export function getStartEndDate(
  months: string[] = [],
  userPermissions: PermissionEntity[],
) {
  const currentDate = new Date();
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();
  const currentDay = currentDate.getUTCDate();
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
    let startDate = new Date(Date.UTC(currentYear, monthIndex, 1));
    let endDate = new Date(
      Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999),
    );
    if (monthIndex === currentDate.getMonth() && userPermissions.length) {
      if (!hasViewPastCasesPermission && !hasViewFutureCasesPermission) {
        // User cannot view past or future cases, show only today’s records
        startDate = new Date(
          Date.UTC(currentYear, currentMonth, currentDay, 0, 0, 0, 0),
        );
        endDate = new Date(
          Date.UTC(currentYear, currentMonth, currentDay, 23, 59, 59, 999),
        );
      } else if (!hasViewPastCasesPermission) {
        // User cannot view past cases, start from tomorrow
        startDate = new Date(
          Date.UTC(currentYear, currentMonth, currentDay + 1),
        );
      } else if (!hasViewFutureCasesPermission) {
        // User cannot view future cases, end at the end of today
        endDate = new Date(
          Date.UTC(currentYear, monthIndex, currentDay - 1, 23, 59, 59, 999),
        );
      }
    }

    return { date: Between(startDate, endDate) };
  });

  return dateConditions;
}

export function getFullYearDateConditions(userPermissions: PermissionEntity[]) {
  const currentDate = new Date();
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();
  const currentDay = currentDate.getUTCDate();

  const hasViewPastCasesPermission = userPermissions.some(
    (permission) => permission.name === USER_PERMISSIONS.VIEW_PAST_CASES,
  );
  const hasViewFutureCasesPermission = userPermissions.some(
    (permission) => permission.name === USER_PERMISSIONS.VIEW_FUTURE_CASES,
  );

  let startDate = new Date(Date.UTC(currentYear, 0, 1));
  let endDate = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59, 999));

  if (userPermissions.length) {
    if (!hasViewPastCasesPermission && !hasViewFutureCasesPermission) {
      // User cannot view past or future cases, show only today’s records
      startDate = new Date(
        Date.UTC(currentYear, currentMonth, currentDay, 0, 0, 0, 0),
      );
      endDate = new Date(
        Date.UTC(currentYear, currentMonth, currentDay, 23, 59, 59, 999),
      );
    } else if (!hasViewPastCasesPermission) {
      startDate = new Date(Date.UTC(currentYear, currentMonth, currentDay + 1));
    } else if (!hasViewFutureCasesPermission) {
      endDate = new Date(
        Date.UTC(currentYear, currentMonth, currentDay - 1, 23, 59, 59, 999),
      );
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
      .join(' ');
  } else return str;
};

export function formatTime(dateString: string) {
  // Create a Date object from the ISO 8601 formatted string
  const dateObject = new Date(dateString);

  // Get hours, minutes, and seconds from the date object
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();

  // Format the time as HH:mm:ss
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return formattedTime;
}
