import {
  CreateSurgeryConfigurationPayload,
  UpdateSurgeryConfigPayload,
} from '@packages/entities/index.browser';
import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
const { API_BASE_URL } = publicRuntimeConfig;

export const getSurgeryConfigurations = async (
  payloadData: {
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/surgeryTypes/configurations`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to get surgery configurations');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const deleteSurgeryConfiguration = async (
  payloadData: {
    practiceId: string;
    surgeryTypeId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/surgeryTypes/configurations/${payloadData.surgeryTypeId}/${payloadData.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete surgery configuration.');
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

export const getSurgeryConfigurationInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
    surgeryTypeId: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/surgeryTypes/configurations/${payloadData.surgeryTypeId}/${payloadData.id}`,
      {
        method: 'GET',
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

export const addSurgeryConfiguration = async ({
  payloadData,
  practiceId,
}: {
  payloadData: CreateSurgeryConfigurationPayload;
  practiceId: string;
}) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/surgeryTypes/configurations/${payloadData.surgeryTypeId}`,
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

export const editSurgeryConfiguration = async ({
  payloadData,
  practiceId,
  id,
}: {
  payloadData: UpdateSurgeryConfigPayload;
  practiceId: string;
  id: string;
}) => {
  try {
    const accessToken = Cookies.get('access_token');
    const surgeryTypeId = payloadData.surgeryTypeId;
    delete payloadData.surgeryTypeId;
    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/surgeryTypes/configurations/${surgeryTypeId}/${id}`,
      {
        method: 'PATCH',
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
