import { publicRuntimeConfig } from 'next.config';

export const login = async (payloadData: {
  email: string;
  password: string;
}) => {
  const { NEXT_PUBLIC_API_BASE_URL } = publicRuntimeConfig;
  try {
    const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadData),
    });
    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};
