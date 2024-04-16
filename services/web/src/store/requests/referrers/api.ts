import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
import { AddReferrer } from '.';
const { API_BASE_URL } = publicRuntimeConfig;

export const getReferrers = async (
  payloadData: { practiceId: string },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/referrer`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch referrers');
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

export const getReferrerInfo = async (
  payloadData: {
    id: string;
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/referrer/${payloadData.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch referrer');
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

export const addReferrer = async (
  payloadData: AddReferrer,
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const { practiceId, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/referrer`,
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
      throw new Error('Failed to add referrer');
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

export const deleteReferrer = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/referrer/${payloadData.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete referrer');
    }
    const responseData = await response.text();

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
