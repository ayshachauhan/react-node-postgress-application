import {
  PracticeCreateInterface,
  PracticesEditInterface,
} from '@components/practices/types';
import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';

export const getPractices = async () => {
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
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
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
    const accessToken = Cookies.get('access_token');
    const response = await fetch(`${API_BASE_URL}/practices`, {
      method: 'Patch',
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
