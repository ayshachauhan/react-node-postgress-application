import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
import { CreateTemplateResponse, EditTemplate } from '.';
const { API_BASE_URL } = publicRuntimeConfig;

export const getTemplates = async (
  payloadData: {
    practiceId: string;
    userId: string;
  },
  { rejectWithValue },
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/users/${payloadData.userId}/templates`,
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

export const addTemplate = async (payloadData: CreateTemplateResponse) => {
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/users/${payloadData.userId}`,
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

export const updateTemplate = async (
  payloadData: EditTemplate,
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const { practiceId, userId, id, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/users/${userId}/templates/${id}`,
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
      throw new Error('Failed to update template');
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

export const deleteTemplate = async (
  payloadData: {
    practiceId: string;
    id: string;
    userId: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/users/${payloadData.userId}/templates/${payloadData.id}`,
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
