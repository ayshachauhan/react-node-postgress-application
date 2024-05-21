import { ISurgery } from '@packages/entities';
type RecordsByDate = {
  [key: string]: ISurgery[];
};

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
  // formattedDateSplit[2] = splitDate[0];

  return formattedDateSplit.join('/');
}

export function formatColumnDate(dateString: string) {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
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

export function removePastSurgeries(surgeries: RecordsByDate) {
  const currentDate = new Date();
  const filteredSurgeries = {};

  for (const key in surgeries) {
    if (Object.prototype.hasOwnProperty.call(surgeries, key)) {
      const [month, day] = key.split('/').map(Number);
      const recordDate = new Date(currentDate.getFullYear(), month - 1, day);

      if (recordDate >= currentDate) {
        filteredSurgeries[key] = surgeries[key];
      }
    }
  }

  return filteredSurgeries;
}
