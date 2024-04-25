import { IMedia, IMediaRequest } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

/**
 * @summary Get Media by PracticeId
 * @param payloadData
 * @param param1
 * @returns Media object as a response
 */
export const getMedia = async (
  payloadData: { practiceId: string },
  { rejectWithValue },
): Promise<IMedia[]> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/videos`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    const data: IMedia[] = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @summary Add Media for a practice
 * @param payloadData
 * @param param1
 * @returns IMedia
 */
export const addMedia = async (
  payloadData: IMediaRequest,
  { rejectWithValue },
): Promise<IMedia> => {
  try {
    const response: Response = await apiClient.post(
      `/practices/${payloadData.practiceId}/videos`,
      payloadData,
    );
    if (!response.ok) {
      throw new Error('Failed to add video');
    }
    const data: IMedia = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
