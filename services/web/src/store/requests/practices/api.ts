import { IPractice } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';
import {
  PracticeCreateInterface,
  PracticesEditInterface,
  PracticesGetInterface,
  UploadImgPayload,
} from '@store/requests/practices';

const apiClient = new ApiService();

/**
 * Get Practices
 * @param _
 * @param param1
 * @returns
 */
export const getPractices = async (
  _,
  { rejectWithValue },
): Promise<PracticesGetInterface[]> => {
  try {
    const response: Response = await apiClient.get(`/practices`);
    if (!response.ok) {
      throw new Error('Failed to get practices');
    }
    const data: PracticesGetInterface[] = await response.json();
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
export const getPracticeData = async (
  payloadData: {
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(`/practices/${payloadData.id}`);
    if (!response.ok) {
      throw new Error('Failed to get practice data');
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
export const addPractice = async (
  payloadData: PracticeCreateInterface,
  { rejectWithValue },
): Promise<IPractice> => {
  try {
    const { practiceImg, ...restPayload } = payloadData;

    const response = await apiClient.post(`/practices`, restPayload);

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message ?? 'Failed to upload img.');
    }

    const data: IPractice = await response.json();

    if (practiceImg && data.id) {
      return await uploadImg({
        practiceId: data.id,
        file: practiceImg,
      });
    }
    return data;
  } catch (error) {
    const msg = (error as Record<string, unknown>).message;

    return rejectWithValue(msg ?? 'An unexpected error occurred.');
  }
};

/**
 *
 * @param payloadData
 * @returns Updated user with Imgurl
 */
export const uploadImg = async (
  payloadData: UploadImgPayload,
): Promise<IPractice> => {
  try {
    const { practiceId, file } = payloadData;
    const formdata = new FormData();
    formdata.append('file', file);

    const response = await apiClient.patch(
      `/practices/${practiceId}/upload`,
      formdata,
      {
        'Content-Type': 'multipart/form-data;',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to upload img.');
    }
    const data: IPractice = await response.json();
    return data;
  } catch (error) {
    throw new Error();
  }
};

/**
 *
 * @param payloadData
 * @param param1
 * @returns
 */
export const editPractice = async (
  payloadData: PracticesEditInterface,
  { rejectWithValue },
) => {
  try {
    const { id, practiceImg, ...restPayload } = payloadData;
    delete payloadData.id;
    const response = await apiClient.patch(`/practices/${id}`, restPayload);
    const data = await response.json();

    if (practiceImg && data.id) {
      return await uploadImg({
        practiceId: data.id,
        file: practiceImg,
      });
    }

    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
};

/**
 *
 * @param payloadData
 * @param param1
 * @returns
 */
export const deletePractice = async (
  payloadData: {
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.id}`,
      null,
    );
    if (!response.ok) {
      throw new Error('Failed to delete practice');
    }

    // this is to handle empty response.
    return null;
  } catch (error) {
    return rejectWithValue(error);
  }
};
