import { publicRuntimeConfig } from 'next.config';

export const getPractices = async () => {
  const { NEXT_PUBLIC_API_BASE_URL } = publicRuntimeConfig;
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/practices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
