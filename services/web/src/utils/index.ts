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
  console.log(date1, date2);

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  // Calculate the difference in milliseconds
  const diffInMilliseconds = utc1 - utc2;

  // Convert milliseconds to days
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const diffInDays = diffInMilliseconds / millisecondsPerDay;

  return diffInDays;
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
