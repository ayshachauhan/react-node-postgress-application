import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
import { AddUser, ChangePasswordInterface, EditUser } from '.';
const { API_BASE_URL } = publicRuntimeConfig;

export const getUsers = async (
  payloadData: { practiceId: string },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/users`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const getUserInfo = async (
  payloadData: {
    id: string;
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/users/${payloadData.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const addUser = async (payloadData: AddUser, { rejectWithValue }) => {
  try {
    const accessToken = Cookies.get('access_token');
    const { practiceId, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(sanitizedPayload),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to add user');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const updateUser = async (
  payloadData: EditUser,
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const { practiceId, id, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/users/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(sanitizedPayload),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const deleteUser = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/users/${payloadData.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    const responseData = await response.text();

    // Check if response body is empty
    if (!responseData.trim()) {
      return; // Exit early or return a default value
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const changePassword = async (
  payloadData: ChangePasswordInterface,
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const { practiceId } = payloadData;

    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/users/change-password`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payloadData),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to change password.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
