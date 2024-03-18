import { publicRuntimeConfig } from 'next.config';

export const login = async (
  payloadData: {
    email: string;
    password: string;
  },
  { rejectWithValue },
) => {
  const { API_BASE_URL } = publicRuntimeConfig;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadData),
    });
    const result = await response.json();
    console.log(result);
    if (result.access_token) {
      return result;
    } else {
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    console.error('Error:', error);
    return rejectWithValue('Invalid username or psassword');
  }
};
