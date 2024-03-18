import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';

export const getPractices = async () => {
  const { NEXT_PUBLIC_API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/practices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
