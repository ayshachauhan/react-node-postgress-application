import {
  IMedia,
  Image,
  MediaType,
  PatientMediaConfig,
} from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';
import Cookies from 'js-cookie';
import { publicRuntimeConfig } from 'next.config';
import { AddMediaDTO, UploadImgPayload } from './types';
const { API_BASE_URL } = publicRuntimeConfig;

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
      `/practices/${payloadData.practiceId}/media`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch media');
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
  payloadData: AddMediaDTO,
  { rejectWithValue },
): Promise<IMedia> => {
  try {
    let response: Response;

    const mediaConfig = payloadData.mediaConfig as PatientMediaConfig;

    if (payloadData.mediaType === MediaType.PATIENT && mediaConfig?.image) {
      const preImageData = mediaConfig.image.map((data: Image) => ({
        title: data.title,
        url: '',
      }));

      response = await apiClient.post(
        `/practices/${payloadData.practiceId}/media`,
        {
          mediaType: payloadData.mediaType,
          mediaConfig: { ...payloadData.mediaConfig, image: preImageData },
        },
      );
      const data: IMedia = await response.json();

      if (mediaConfig.image && data.id) {
        return await uploadImg({
          practiceId: payloadData.practiceId,
          mediaId: data.id,
          //@ts-expect-error add types
          files: mediaConfig.image,
        });
      }
      return data;
    }

    response = await apiClient.post(
      `/practices/${payloadData.practiceId}/media`,
      {
        mediaType: payloadData.mediaType,
        mediaConfig: payloadData.mediaConfig,
      },
    );
    if (!response.ok) {
      throw new Error('Failed to add media');
    }
    const data: IMedia = await response.json();

    console.log(data, 'datamedia');

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const uploadImg = async (
  payloadData: UploadImgPayload,
): Promise<IMedia> => {
  try {
    const { practiceId, mediaId, files } = payloadData;
    const formData = new FormData();
    files.forEach((file) => {
      if (file.file) formData.append('files', file.file);
    });

    const accessToken = Cookies.get('access_token');

    const response = await fetch(
      `${API_BASE_URL}/practices/${practiceId}/media/${mediaId}/upload`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error('Failed to upload images.');
    }
    const data: IMedia = await response.json();
    return data;
  } catch (error) {
    throw new Error();
  }
};
