import {
  PracticeCreateInterface,
  PracticesEditInterface,
} from '@store/requests/practices';

import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
const { API_BASE_URL } = publicRuntimeConfig;

export const getPractices = async (_, { rejectWithValue }) => {
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
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const getPracticeData = async (
  payloadData: {
    id: string;
  },
  { rejectWithValue },
) => {
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
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const addPractice = async (payloadData: PracticeCreateInterface) => {
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
      throw new Error('Failed to delete practice');
    }

    // this is to handle empty response.
    return null;
  } catch (error) {
    return rejectWithValue(error);
  }
};
