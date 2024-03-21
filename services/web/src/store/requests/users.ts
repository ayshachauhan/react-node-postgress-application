import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';

export const getUsers = async (
  payloadData: { practiceId: string },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
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
    return rejectWithValue(error); // Pass error message to payload
  }
};

export const getUserInfo = async (
  payloadData: {
    id: string;
    practiceId: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
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
    return rejectWithValue(error); // Pass error message to payload
  }
};

export const addUser = async (
  payloadData: {
    practiceId: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    fullName: string;
    url: string;
    type: string;
    status: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
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
    return rejectWithValue(error); // Pass error message to payload
  }
};

export const updateUser = async (
  payloadData: {
    practiceId: string;
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    fullName: string;
    url: string;
    type: string;
    status: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
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
      throw new Error('Failed to add user');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error); // Pass error message to payload
  }
};

export const deleteUser = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
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
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error); // Pass error message to payload
  }
};
