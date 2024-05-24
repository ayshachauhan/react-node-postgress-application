import { IReview } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';
import { AddReview, EditReview } from '.';

const apiClient = new ApiService();

/**
 * @param payloadData
 * @param param1
 * @returns All reviews by practiceid
 */
export const getReviews = async (
  payloadData: { practiceId: string },
  { rejectWithValue },
) => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/review`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    const data: IReview[] = await response.json();
    console.log('reviews: ', data);
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
 * @returns Get reviews Info By Id
 */
export const getReviewInfo = async (
  payloadData: {
    id: string;
    practiceId: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.get(
      `/practices/${payloadData.practiceId}/review/${payloadData.id}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch review');
    }
    const data: IReview = await response.json();
    console.log('data:  ', data);
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
export const addReview = async (
  payloadData: AddReview,
  { rejectWithValue },
) => {
  try {
    const { practiceId, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.post(
      `/practices/${practiceId}/review`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to add review');
    }
    const data: IReview = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const deleteReview = async (
  payloadData: {
    practiceId: string;
    id: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/review/${payloadData.id}`,
    );
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
    const responseData = await response.text();

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

/**
 * @summary Update review
 * @param payloadData
 * @param param1
 * @returns
 */
export const updateReview = async (
  payloadData: EditReview,
  { rejectWithValue },
) => {
  try {
    const { practiceId, id, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.patch(
      `/practices/${practiceId}/review/${id}`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to update review');
    }
    const data: EditReview = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
