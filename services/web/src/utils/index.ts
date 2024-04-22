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

export function toFullName({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return generateFullName(firstName, lastName);
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
