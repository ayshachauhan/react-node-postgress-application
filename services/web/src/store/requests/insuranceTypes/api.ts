import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
import { CreateInsuranceTypeInterface } from '.';
const { API_BASE_URL } = publicRuntimeConfig;

export const getInsuranceTypes = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/insurance-types`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to get templates');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const addInsuranceType = async (
  payloadData: CreateInsuranceTypeInterface,
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/insurance-types`,
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

export const deleteInsuranceType = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/insurance-types/${payloadData.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete template');
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

export const getInsuranceTypeInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/insurance-types/${payloadData.id}`,
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
