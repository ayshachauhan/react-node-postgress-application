import { IUser } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';
import { SanitizedUser } from '@root/store/types';
import { AddUserDto, ChangePasswordInterface, UploadImgPayload } from '.';

const apiClient = new ApiService();

/**
 * @param payloadData
 * @param param1
 * @returns All Users by practiceid
 */
export const getUsers = async (
  payloadData: { practiceId: string },
  { rejectWithValue },
): Promise<SanitizedUser[]> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/users`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data: IUser[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @param payloadData
 * @param param1
 * @returns Get user Info By Id
 */
export const getUserInfo = async (
  payloadData: {
    id: string;
    practiceId: string;
  },
  { rejectWithValue },
): Promise<SanitizedUser> => {
  try {
    const response = await apiClient.get(
      `/practices/${payloadData.practiceId}/users/${payloadData.id}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data: SanitizedUser = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 *
 * @param payloadData
 * @param param1
 * @returns
 */
export const addUser = async (
  payloadData: AddUserDto,
  { rejectWithValue },
): Promise<SanitizedUser> => {
  try {
    const { practiceId, file, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };

    const response = await apiClient.post(
      `/practices/${practiceId}/users`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to add user');
    }
    const data: SanitizedUser = await response.json();

    if (file && practiceId && data.id) {
      return await uploadImg({
        practiceId,
        id: data.id,
        file,
      });
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @summary Update user
 * @param payloadData
 * @param param1
 * @returns
 * @note ToDO: Need to udpate types as we are getting santized respones back
 */
export const updateUser = async (
  payloadData: Omit<
    IUser,
    | 'password'
    | 'practices'
    | 'dateCreated'
    | 'dateUpdated'
    | 'permissions'
    | 'surgeries'
  > & { file: File | null },
  { rejectWithValue },
): Promise<SanitizedUser> => {
  try {
    const { practiceId, id, file, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.patch(
      `/practices/${practiceId}/users/${id}`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    const data: SanitizedUser = await response.json();

    if (file && practiceId && data.id) {
      return await uploadImg({
        practiceId,
        id: data.id,
        file,
      });
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const deleteUser = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/users/${payloadData.id}`,
      null,
    );
    if (!response.ok) {
      throw new Error('Failed to delete user');
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

/**
 *
 * @param payloadData
 * @param param1
 * @returns
 */
export const changePassword = async (
  payloadData: ChangePasswordInterface,
  { rejectWithValue },
): Promise<SanitizedUser> => {
  try {
    const { practiceId } = payloadData;

    const response = await apiClient.patch(
      `/practices/${practiceId}/users/change-password`,
      payloadData,
    );
    if (!response.ok) {
      throw new Error('Failed to change password.');
    }
    const data: SanitizedUser = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 *
 * @param payloadData
 * @returns Updated user with Imgurl
 */
export const uploadImg = async (
  payloadData: UploadImgPayload,
): Promise<SanitizedUser> => {
  try {
    const { practiceId, id, file } = payloadData;
    const formdata = new FormData();
    formdata.append('file', file);

    const response = await apiClient.patch(
      `/practices/${practiceId}/users/${id}/upload`,
      formdata,
      {
        'Content-Type': 'multipart/form-data;',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to upload img.');
    }
    const data: SanitizedUser = await response.json();
    return data;
  } catch (error) {
    throw new Error();
  }
};
