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
    if (!response.ok) {
      throw new Error('Invalid username or password');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
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
  if (!response.ok) {
    const errorResponse = await response.json();

    if (response.status === 403) {
      throw new Error('Access Denied');
    }

    throw new Error(errorResponse.message || 'Failed to fetch user data');
  }

  const data = await response.json();
  return data;
};
