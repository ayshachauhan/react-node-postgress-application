import { SurgeryStatus } from '@packages/entities';
import { ICalendar, MonthOption } from '@packages/entities/index.browser';
import { DEFAULT_SURGERYLOCATION_COLOR } from '@root/utils/constants';
import moment from 'moment';

export function indexBy<K extends keyof T, T>(
  key: K,
  array: T[],
): Record<string, T> {
  return array.reduce((acc: Record<string, T>, element: T) => {
    acc[String(element[key])] = element;
    return acc;
  }, {});
}

export function getPracticeId() {
  const practiceId = localStorage.getItem('practiceId');
  return practiceId;
}

export const SELECTED_DOCTOR_KEY: string = 'SELECTED_DOCTOR';

export function getUserId(): string | null {
  return localStorage.getItem(SELECTED_DOCTOR_KEY);
}

export function extractVideoId(url: string): string {
  const regExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  if (match) {
    return match[1];
  }
  return '';
}

export function getImageUrl(videoUrl: string): string {
  const youTubeVideoid = extractVideoId(videoUrl);
  return `https://img.youtube.com/vi/${youTubeVideoid}/hqdefault.jpg`;
}

export function generateFullName(firstName: string, lastName: string): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else {
    return '';
  }
}

export function toFullName(
  input: { firstName?: string; lastName?: string } | undefined,
) {
  if (!input) {
    return '';
  }
  return generateFullName(input.firstName ?? '', input.lastName ?? '');
}

export function usDateFormatter(date: Date): string {
  const myDateWithoutTime: string = String(date).split('T')[0];
  const splitDate: string[] = myDateWithoutTime.split('-');
  const formattedDateSplit: string[] = [];
  formattedDateSplit[0] = splitDate[1];
  formattedDateSplit[1] = splitDate[2];
  formattedDateSplit[2] = splitDate[0];

  return formattedDateSplit.join('/');
}

export function formatColumnDate(dateString: Date) {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${hours % 12 || 12}:${
    minutes < 10 ? '0' : ''
  }${minutes}${ampm}`;
  const result = `${formattedDate} | ${formattedTime}`;
  return result;
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

export function formatDate(dateString: Date) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return `${month}/${day}/${year}`;
}

export function constructQueryParams(params: {
  includeDeleted?: boolean;
  month?: string;
  searchMRNName?: string;
  option?: string;
  loggedInUserId?: string;
  doctorId?: string;
}): string {
  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`,
    )
    .join('&');

  return queryString ? `?${queryString}` : '';
}

export const getIpAddress = async (): Promise<string> => {
  const response = await fetch('https://api.ipify.org?format=json&ipv=4');

  const data = await response.json();
  return data.ip;
};

export const getDifferenceInDays = (date1: Date, date2: Date): number => {
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

export const toPascalCase = (str: string): string => {
  if (str) {
    return str
      .split(' ') // Split the string by spaces, underscores, or hyphens
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter and make the rest lowercase
      .join(' ');
  } else return str;
};

export const jsonResponseFromStream = async (response: Response) => {
  if (response && response.body) {
    // Access the response body as a ReadableStream
    const reader = await response.body?.getReader();
    const decoder = new TextDecoder();
    let responseBody = '';

    // Read the response body stream
    const readStream = async () => {
      const { done, value } = await reader.read();
      if (done) {
        return responseBody;
      }
      responseBody += decoder.decode(value, { stream: true });
      return readStream();
    };

    const responsedata = await readStream();
    console.log('JSON response from body: ', JSON.parse(responsedata));
    return JSON.parse(responsedata);
  }
  return response;
};

export const validateEmail = (email?: string) => {
  const validObj = { isValid: true, error: '' };
  if (!email) {
    validObj.isValid = false;
    validObj.error = 'Please enter the email address.';
    return validObj;
  }
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = regex.test(String(email).toLowerCase());
  if (!isValid) {
    validObj.isValid = false;
    validObj.error = 'Invalid Email address';
    return validObj;
  }
  return validObj;
};

export const getSelectedMonths = (selectedMonth: MonthOption[]) => {
  const monthLabels = selectedMonth.map((month) => month.label);
  const month = monthLabels.join(',');
  return month;
};

export const getCurrentMonthName = () => {
  const date = new Date();
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
  return monthNames[date.getMonth()];
};

export const getColorForSurgeryStatus = (status) => {
  switch (status) {
    case SurgeryStatus.BOOK:
      return 'bg-purple-400';
    case SurgeryStatus.PENDING:
      return 'bg-yellow-400';
    case SurgeryStatus.DATE_CHANGE:
      return 'bg-orange-400';
    case SurgeryStatus.POSTPONE:
      return 'bg-blue-400';
    case SurgeryStatus.CANCELLED:
      return 'bg-red-400';
    case SurgeryStatus.COMPLETED:
      return 'bg-green-400';
    case SurgeryStatus.CONFIRMED:
      return 'bg-gray-400';
    default:
      return 'bg-indigo-400';
  }
};

export const abbreviatePracticeHome = (str) => {
  return str.match(/\b\w/g).join('').toUpperCase();
};

export const createQueryString = (params): string => {
  const queryString = new URLSearchParams();
  if (params) {
    Object.keys(params).forEach((key) => {
      queryString.append(key, params[key]);
    });
  }
  return queryString.toString();
};

export const isCalendarDates = (
  date: Date,
  calendars: ICalendar[],
): boolean => {
  const formattedDate = moment(date).format('YYYY-MM-DD'); // Get date part only

  const dates = (calendars as ICalendar[])
    .filter((calendar: ICalendar) =>
      moment(calendar?.date).format('YYYY-MM-DD'),
    )
    .map((calendar) => moment(calendar?.date).format('YYYY-MM-DD'));

  return Boolean(dates.find((date) => date === formattedDate));
};

export const isSlotsAvailable = (
  date: Date,
  calendars: ICalendar[],
): Record<string, unknown> => {
  const formattedDate = moment(date).format('YYYY-MM-DD'); // Get date part only

  const matchingCalendars = (calendars as ICalendar[]).filter(
    (calendar: ICalendar) =>
      moment(calendar.date).format('YYYY-MM-DD') === formattedDate,
  ) as ICalendar[];

  const sortedCalendars = matchingCalendars.sort((a, b) => {
    if (a.maxSlots !== b.maxSlots) {
      return b.maxSlots - a.maxSlots; // Descending order by maxSlots
    } else if (a.bookedSlots !== b.bookedSlots) {
      return b.bookedSlots - a.bookedSlots; // Descending order by bookedSlots
    } else {
      return a.surgeryType.name.localeCompare(b.surgeryType.name); // Alphabetical order by surgeryType.name
    }
  });

  const calendar = sortedCalendars[0];

  const surgeryTypeColor =
    calendar.surgeryType?.color ?? DEFAULT_SURGERYLOCATION_COLOR;

  return calendar.maxSlots > calendar.bookedSlots
    ? {
        backgroundColor: surgeryTypeColor,
        borderTopColor: surgeryTypeColor,
        borderBottomColor: surgeryTypeColor,
        borderRightColor: surgeryTypeColor,
        borderLeftColor: surgeryTypeColor,
      }
    : {
        backgroundColor: 'transparent',
        border: `${surgeryTypeColor} solid 3px`,
        borderTopColor: surgeryTypeColor,
        borderBottomColor: surgeryTypeColor,
        borderRightColor: surgeryTypeColor,
        borderLeftColor: surgeryTypeColor,
      };
};

export const getBackGroundColorCss = (
  date: Date,
  currentMonth,
  calendars: ICalendar[],
): Record<string, unknown> => {
  // checking selected month here because sometimes bg colors are reflecting in next month

  // console.log(date, date.getMonth() + 1, 'datebg', currentMonth);

  return date.getMonth() + 1 == currentMonth
    ? isCalendarDates(date, calendars)
      ? isSlotsAvailable(date, calendars)
      : { backgroundColor: 'transparent', color: '#000000' }
    : {};
};

export const customBackgroundColor = (
  date: Date,
  calendars: ICalendar[],
): string => {
  const formattedDate = moment(date).format('YYYY-MM-DD'); // Get date part only

  const matchingCalendars = (calendars as ICalendar[]).filter(
    (calendar: ICalendar) =>
      moment(calendar.date).format('YYYY-MM-DD') === formattedDate,
  ) as ICalendar[];
  console.log(matchingCalendars);
  const sortedCalendars = matchingCalendars.sort((a, b) => {
    if (a.maxSlots !== b.maxSlots) {
      return b.maxSlots - a.maxSlots; // Descending order by maxSlots
    } else if (a.bookedSlots !== b.bookedSlots) {
      return b.bookedSlots - a.bookedSlots; // Descending order by bookedSlots
    } else {
      return a.surgeryType.name.localeCompare(b.surgeryType.name); // Alphabetical order by surgeryType.name
    }
  });

  const calendar = sortedCalendars[0];

  const surgeryTypeColor =
    calendar.surgeryType?.color ?? DEFAULT_SURGERYLOCATION_COLOR;

  return calendar.maxSlots > calendar.bookedSlots
    ? surgeryTypeColor
    : 'transparent';
};
