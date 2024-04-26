import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
import { CreateEvalInterface } from './types';
const { API_BASE_URL } = publicRuntimeConfig;

export const getEvals = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/evals`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to get evals');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const addEval = async (payloadData: CreateEvalInterface) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/evals`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payloadData),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteEval = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/evals/${payloadData.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete eval');
    }
    const responseData = await response.text();

    // Check if response body is empty
    if (!responseData.trim()) {
      return;
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

export const getEvalInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/evals/${payloadData.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payloadData),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};
