import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
import { User } from '.';

export const login = async (
  payloadData: {
    email: string;
    password: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadData),
    });
    const result = await response.json();
    if (result?.access_token) {
      return result;
    } else {
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    return rejectWithValue('Invalid username or psassword');
  }
};

export const getMe = async (): Promise<User> => {
  const { API_BASE_URL } = publicRuntimeConfig;
  const accessToken = Cookies.get('access_token');
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};
