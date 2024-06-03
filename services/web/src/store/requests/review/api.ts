import {
  IReview,
  PostUserReview,
  ValidateReviewRequest,
} from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';
import { AddReview, EditReview, SendReview } from '.';

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

/**
 * @summary Send review request
 * @param payloadData
 * @param param1
 * @returns
 */
export const sendReviewRequest = async (
  payloadData: SendReview,
  { rejectWithValue },
) => {
  try {
    console.log('sending request');
    const { practiceId, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.post(
      `/practices/${practiceId}/review/send`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to send review request');
    }
    const data: SendReview = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error during sending review request');
  }
};

/**
 * @summary Validate review request
 * @param payloadData token
 * @returns
 */
export const validateReviewRequest = async (
  payloadData: ValidateReviewRequest,
  { rejectWithValue },
) => {
  try {
    console.log('validating review request', payloadData);
    const { practiceId, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.post(
      `/practices/${practiceId}/review/validate-request`,
      sanitizedPayload,
    );
    console.log('response from api: ', response);
    if (!response.ok) {
      if (response.status == 401) {
        throw new Error('Invalid or expired review link opened');
      }
      throw new Error('Failed to validate review request');
    }
    const data: ValidateReviewRequest = await response.json();
    console.log('response data: ', data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error during sending review request');
  }
};

/**
 * @summary Post user review and save
 * @param payloadData token
 * @returns
 */
export const postUserReview = async (
  payloadData: PostUserReview,
  { rejectWithValue },
) => {
  try {
    console.log('posting review');
    const { practiceId, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.post(
      `/practices/${practiceId}/review/user-post`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to save review commnet');
    }
    const data: PostUserReview = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error during saving review comments');
  }
};
