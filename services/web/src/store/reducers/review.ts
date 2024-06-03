import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import {
  addReview,
  deleteReview,
  getReviewInfo,
  getReviews,
  postUserReview,
  sendReviewRequest,
  updateReview,
  validateReviewRequest,
} from '../requests/review';
import { EntityLoadingState, ReviewState } from '../types';

const initialState: ReviewState = {
  processing: false,
  entities: {},
  reviewInfo: null,
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = undefined;
    },
    clearErrorMessage(state) {
      state.errorMessage = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListings.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {};
      if (action.payload.length === 0) {
        state.errorMessage = 'No records found';
      } else {
        state.errorMessage = undefined;
      }
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch reviews';
      } else {
        state.errorMessage = 'Failed to fetch reviews';
      }
      state.processing = false;
    });

    builder.addCase(fetchReviewInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchReviewInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.reviewInfo = action.payload;
    });

    builder.addCase(fetchReviewInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch review info';
      } else {
        state.errorMessage = 'Failed to fetch review info';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'Record added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add review';
      } else {
        state.errorMessage = 'Failed to add review';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deletetedReviewId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletetedReviewId]: deletedReview,
        ...remainingReviews
      } = state.entities;
      state.entities = remainingReviews;
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete review';
      } else {
        state.errorMessage = 'Failed to delete review';
      }
    });

    builder.addCase(updateRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(updateRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;

      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'Record updated successfully';
    });

    builder.addCase(updateRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to update review';
      } else {
        state.errorMessage = 'Failed to update review';
      }
    });

    builder.addCase(sendReviewRequestAsyncThunk.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(sendReviewRequestAsyncThunk.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;

      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'Request sent successfully';
    });

    builder.addCase(sendReviewRequestAsyncThunk.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'An error occurred';
      } else {
        state.errorMessage = 'An error occurred';
      }
    });

    builder.addCase(validateReviewRequestAsyncThunk.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(
      validateReviewRequestAsyncThunk.fulfilled,
      (state, action) => {
        state.status = EntityLoadingState.SUCCEEDED;

        state.entities = {
          ...state.entities,
          ...{ [action.payload.token]: action.payload },
        };
        state.successMessage = '';
      },
    );

    builder.addCase(
      validateReviewRequestAsyncThunk.rejected,
      (state, action) => {
        state.status = EntityLoadingState.FAILED;
        if (typeof action.payload === 'string') {
          state.errorMessage = action.payload ?? 'An error occurred';
        } else {
          state.errorMessage = 'An error occurred';
        }
      },
    );
  },
});
export const { clearSuccessMessage, clearErrorMessage } = reviewSlice.actions;

export const fetchListings = createAsyncThunk(
  'reviews/fetchListings',
  getReviews,
);

export const fetchReviewInfo = createAsyncThunk(
  'reviews/fetchReviewInfo',
  getReviewInfo,
);

export const addRecordAsync = createAsyncThunk(
  'reviews/addRecordAsync',
  addReview,
);

export const deleteRecordAsync = createAsyncThunk(
  'reviews/deleteRecordAsync',
  deleteReview,
);

export const updateRecordAsync = createAsyncThunk(
  'reviews/updateRecordAsync',
  updateReview,
);

export const sendReviewRequestAsyncThunk = createAsyncThunk(
  'reviews/sendReviewRequestAsyncThunk',
  sendReviewRequest,
);

export const validateReviewRequestAsyncThunk = createAsyncThunk(
  'reviews/validateReviewRequest',
  validateReviewRequest,
);

export const postReviewAsyncThunk = createAsyncThunk(
  'reviews/postUserReview',
  postUserReview,
);

export default reviewSlice.reducer;
