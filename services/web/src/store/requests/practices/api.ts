import {
  PracticeCreateInterface,
  PracticesEditInterface,
} from '@components/practices/types';

import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';

export const getPractices = async (_, { rejectWithValue }) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(`${API_BASE_URL}/practices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get practices');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const getPracticeData = async (
  payloadData: {
    id: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to get practice data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error); // Pass error message to payload
  }
};

export const addPractice = async (payloadData: PracticeCreateInterface) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(`${API_BASE_URL}/practices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payloadData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const editPractice = async (payloadData: PracticesEditInterface) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const { id } = payloadData;
    delete payloadData.id;
    const accessToken = Cookies.get('access_token');
    const response = await fetch(`${API_BASE_URL}/practices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payloadData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deletePractice = async (
  payloadData: {
    id: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.id}`,
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

    if (!responseData.trim()) {
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};
