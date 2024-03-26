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
