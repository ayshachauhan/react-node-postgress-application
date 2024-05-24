import { CreateSurgeryPayload, UpdateSurgeryPayload } from '@packages/entities';
import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
const { API_BASE_URL } = publicRuntimeConfig;

const getIpAddress = async (): Promise<string> => {
  const response = await fetch('https://api.ipify.org?format=json&ipv=4');

  const data = await response.json();

  return data.ip;
};

export const getSurgeries = async (
  payloadData: {
    practiceId: string;
    includeDeleted?: boolean;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${
        payloadData.practiceId
      }/surgery?includeDeleted=${payloadData.includeDeleted ?? false}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to get surgery');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const addSurgery = async (payloadData: CreateSurgeryPayload) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/surgery`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...payloadData,
          ipAddress: await getIpAddress(),
        }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteSurgery = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/surgery/${payloadData.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ipAddress: await getIpAddress(),
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete surgery');
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

export const getSurgeryInfo = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/surgery/${payloadData.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await response.json();

    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

export const updateSurgery = async ({
  payload,
  id,
}: {
  payload: UpdateSurgeryPayload;
  id: string;
}) => {
  try {
    const { practiceId } = payload;
    delete payload.practiceId;
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/surgery/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...payload, ipAddress: await getIpAddress() }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
