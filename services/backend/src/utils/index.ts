import { BadRequestException } from '@nestjs/common';
import { PermissionEntity } from '@packages/entities/*';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import * as CryptoJS from 'crypto-js';
import { fromBuffer } from 'file-type';
import { Between } from 'typeorm';
import { allowedExtensions, allowedMimeTypes } from './constants';

const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

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

  const dateConditions = months.flatMap((month) => {
    const monthIndex = monthMap[month];
    if (monthIndex > currentMonth && !hasViewFutureCasesPermission) {
      const startDate = new Date(Date.UTC(9999, 0, 1)); // Far future date
      const endDate = new Date(Date.UTC(9999, 0, 2)); // Just one day after
      return { date: Between(startDate, endDate) };
    }

    if (monthIndex < currentMonth && !hasViewPastCasesPermission) {
      // Set startDate and endDate to an impossible range to ensure no data is returned
      const startDate = new Date(Date.UTC(9999, 0, 1)); // Far future date
      const endDate = new Date(Date.UTC(9999, 0, 2)); // Just one day after
      return { date: Between(startDate, endDate) };
    }

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

  let startDate: Date;
  let endDate: Date;

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
      startDate = new Date(Date.UTC(currentYear, currentMonth, currentDay - 1));
      endDate = new Date(Date.UTC(2100, 11, 31, 23, 59, 59, 999)); // Arbitrary far future date
    } else if (!hasViewFutureCasesPermission) {
      startDate = new Date(Date.UTC(1900, 0, 1));
      endDate = new Date(
        Date.UTC(currentYear, currentMonth, currentDay - 1, 23, 59, 59, 999),
      );
    } else {
      startDate = new Date(Date.UTC(1900, 0, 1)); // Start from a very early date
      endDate = new Date(Date.UTC(2100, 11, 31, 23, 59, 59, 999)); // Arbitrary far future date
    }
  } else {
    startDate = new Date(
      Date.UTC(currentYear, currentMonth, currentDay, 0, 0, 0, 0),
    );
    endDate = new Date(
      Date.UTC(currentYear, currentMonth, currentDay, 23, 59, 59, 999),
    );
  }

  return [{ date: Between(startDate, endDate) }];
}

export function formatDateWithMicrosecondsUTC(dateObject) {
  const year = dateObject.getUTCFullYear();
  const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getUTCDate().toString().padStart(2, '0');
  const hours = dateObject.getUTCHours().toString().padStart(2, '0');
  const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
  const seconds = dateObject.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = dateObject
    .getUTCMilliseconds()
    .toString()
    .padStart(3, '0');

  // Format the date in ISO 8601 format with microseconds and 'Z'
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
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

export function filterUpcomingSurgeries(data) {
  const currentDate = new Date();
  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= currentDate;
  });
}

export function setToMidnight(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export const getDateDiffInDays = (date1: Date, date2: Date): number => {
  // Convert both dates to UTC to avoid timezone issues

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  // Calculate the difference in milliseconds
  const diffInMilliseconds = utc1 - utc2;

  // Convert milliseconds to days
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const diffInDays = diffInMilliseconds / millisecondsPerDay;

  return diffInDays;
};

export function decryptPassword(encryptedPassword: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function checkFileType(buffer: Buffer) {
  const fileType = await fromBuffer(buffer);

  if (!fileType) {
    throw new BadRequestException('Unsupported or invalid file type.');
  }

  const { ext, mime } = fileType;

  if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(mime)) {
    throw new BadRequestException(
      'Invalid file type. Only images are allowed.',
    );
  }

  return { ext, mime };
}

export async function validatePDFContent(
  file: Express.Multer.File,
): Promise<boolean> {
  try {
    const header = file.buffer.toString('utf-8', 0, 5);
    return header === '%PDF-';
  } catch (error) {
    throw new BadRequestException('Failed to validate PDF content');
  }
}
