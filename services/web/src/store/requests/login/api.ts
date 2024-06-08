import { ApiService } from '@root/services/apiclient';
import { COOKIES } from '@root/services/cookies';
import Cookies from 'js-cookie';
import { User } from '.';

export const setLoginCookie = (accessToken: string): void => {
  Cookies.set(COOKIES.ACCESS_TOKEN, accessToken, {
    expires: 1,
  });
};

export const getLoginToken = (): string | undefined => {
  return Cookies.get(COOKIES.ACCESS_TOKEN);
};

export const removeLoginToken = () => {
  Cookies.remove(COOKIES.ACCESS_TOKEN);
};

const apiClient = new ApiService();

export const login = async (
  payloadData: {
    email: string;
    password: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.post('/auth/login', payloadData);

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
  const response = await apiClient.get('/auth/me');

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

/**
 *
 * @param param0 email
 * @returns string msg
 */
export const sendResetMail = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  const response = await apiClient.get(`/auth/resetLink/${email}`);

  if (!response.ok) {
    const errorResponse = await response.json();

    if (response.status === 403) {
      throw new Error('Access Denied');
    }

    throw new Error(
      errorResponse.message || 'Failed to send reset password mail',
    );
  }

  const data: string = 'Email Sent!';

  return data;
};
