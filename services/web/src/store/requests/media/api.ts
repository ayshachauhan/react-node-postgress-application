import { MediaConfigType } from '@packages/entities';
import { IMedia } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';
import {
  AddMediaDTO,
  DeleteMediaPayload,
  DeleteMediaType,
  PatientMediaConfig,
  UploadImgPayload,
} from './types';

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
    const mediaConfig = payloadData.mediaConfig as PatientMediaConfig;

    const videoData =
      mediaConfig?.video?.map((data) => ({
        title: data.title,
        url: data.url,
        configType: MediaConfigType.VIDEO,
      })) ?? [];

    const response: Response = await apiClient.post(
      `/practices/${payloadData.practiceId}/media`,
      {
        mediaType: payloadData.mediaType,
        entityId: payloadData.entityId,
        mediaConfig: videoData,
      },
    );
    const data: IMedia = await response.json();

    if (mediaConfig.image && data.id) {
      return await uploadImg({
        practiceId: payloadData.practiceId,
        mediaId: data.id,
        // @ts-expect-error fix type error
        files: mediaConfig?.image,
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

export const uploadImg = async (
  payloadData: UploadImgPayload,
): Promise<IMedia> => {
  try {
    const { practiceId, mediaId, files } = payloadData;
    const formData = new FormData();
    files.forEach((file) => {
      if (file.file) {
        const sanitizedTitle = file.title.replace(/ /g, '_');
        const newFile = new File([file.file], sanitizedTitle, {
          type: file.file.type,
        });

        console.log(newFile, 'newfile');

        formData.append('files', newFile);
      }
    });

    const response = await apiClient.upload(
      `/practices/${practiceId}/media/${mediaId}/upload`,
      formData,
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

export const deleteMedia = async (
  payloadData: DeleteMediaPayload,
  { rejectWithValue },
): Promise<IMedia[]> => {
  try {
    const response: Response = await apiClient.delete(
      payloadData.type === DeleteMediaType.Media
        ? `/practices/${payloadData.practiceId}/media/${payloadData.mediaId}`
        : `/practices/${payloadData.practiceId}/media/mediaconfig/${payloadData.mediaConfigId}`,
    );

    if (!response.ok) {
      throw new Error('Failed to delete media');
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

export const sendMediaToPatient = async (payloadData: {
  practiceId: string;
  data: {
    mrn: string;
    links: string[];
  };
}) => {
  try {
    const response: Response = await apiClient.post(
      `/practices/${payloadData.practiceId}/media/send-video-to-patient`,
      payloadData.data,
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};
