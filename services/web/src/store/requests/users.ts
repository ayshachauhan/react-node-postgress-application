import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';

export const getUsers = async (payloadData: { practiceId: string }) => {
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
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getUserInfo = async (payloadData: {
  id: string;
  practiceId: string;
}) => {
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
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const addUser = async (payloadData: {
  practiceId: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  url: string;
  type: string;
  status: string;
}) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const { practiceId, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    console.log(sanitizedPayload);
    const response = await fetch(
      `${API_BASE_URL}/practices/${payloadData.practiceId}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(sanitizedPayload),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const updateUser = async (payloadData: {
  practiceId: string;
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  url: string;
  type: string;
  status: string;
}) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const accessToken = Cookies.get('access_token');
    const { practiceId, id, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    console.log(sanitizedPayload);
    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/users/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(sanitizedPayload),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
