import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import {
  addReferrer,
  deleteReferrer,
  getReferrerInfo,
  getReferrers,
  updateReferrer,
} from '../requests/referrers';
import { EntityLoadingState, ReferrerState } from '../types';

const initialState: ReferrerState = {
  processing: false,
  entities: {},
  referrerInfo: null,
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const referrerSlice = createSlice({
  name: 'referrers',
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
        state.errorMessage = action.payload ?? 'Failed to fetch referrers';
      } else {
        state.errorMessage = 'Failed to fetch referrers';
      }
      state.processing = false;
    });

    builder.addCase(fetchReferrerInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchReferrerInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.referrerInfo = action.payload;
    });

    builder.addCase(fetchReferrerInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch referrer info';
      } else {
        state.errorMessage = 'Failed to fetch referrer info';
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
        state.errorMessage = action.payload ?? 'Failed to add referrer';
      } else {
        state.errorMessage = 'Failed to add referrer';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deletetedReferrerId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletetedReferrerId]: deletedReferrer,
        ...remainingReferrers
      } = state.entities;
      state.entities = remainingReferrers;
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete referrer';
      } else {
        state.errorMessage = 'Failed to delete referrer';
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
        state.errorMessage = action.payload ?? 'Failed to update referrer';
      } else {
        state.errorMessage = 'Failed to update referrer';
      }
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } = referrerSlice.actions;

export const fetchListings = createAsyncThunk(
  'referrers/fetchListings',
  getReferrers,
);

export const fetchReferrerInfo = createAsyncThunk(
  'referrers/fetchReferrerInfo',
  getReferrerInfo,
);

export const addRecordAsync = createAsyncThunk(
  'referrers/addRecordAsync',
  addReferrer,
);

export const deleteRecordAsync = createAsyncThunk(
  'referrers/deleteRecordAsync',
  deleteReferrer,
);

export const updateRecordAsync = createAsyncThunk(
  'referrers/updateRecordAsync',
  updateReferrer,
);

export default referrerSlice.reducer;
