import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';

export const getMedia = async () => {
  const { NEXT_PUBLIC_API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${NEXT_PUBLIC_API_BASE_URL}/practices/12e738c5-bded-4733-837f-b6fa987284cf/videos`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return error;
  }
};
