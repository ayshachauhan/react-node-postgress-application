import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import {
  Referrer,
  addReferrer,
  deleteReferrer,
  getReferrerInfo,
  getReferrers,
} from '../requests/referrers';

type EmptyObject = Record<string, never>;

export interface ReferrerState {
  isProcessing: boolean;
  entities: Record<string, Referrer>;
  referrers: Referrer[];
  referrerInfo: Referrer | EmptyObject;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string;
  error: string;
}

const initialState: ReferrerState = {
  isProcessing: false,
  entities: {},
  referrers: [],
  referrerInfo: {},
  status: 'idle',
  successMessage: '',
  error: '',
};

const referrerSlice = createSlice({
  name: 'referrers',
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = '';
    },
    clearErrorMessage(state) {
      state.error = '';
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListings.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = 'idle';
      if (action.payload.length === 0) {
        state.error = 'No records found';
      } else {
        state.error = '';
      }
      state.referrers = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch referrers';
      } else {
        state.error = 'Failed to fetch referrers';
      }
      state.referrers = [];
    });
    builder.addCase(fetchReferrerInfo.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(fetchReferrerInfo.fulfilled, (state, action) => {
      state.status = 'idle';
      state.referrerInfo = action.payload;
    });

    builder.addCase(fetchReferrerInfo.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch referrer info';
      } else {
        state.error = 'Failed to fetch referrer info';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.referrers = [...state.referrers, action.payload];
      state.successMessage = 'Record added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to add referrer';
      } else {
        state.error = 'Failed to add referrer';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      const deletetedReferrerId = action?.meta?.arg?.id;
      state.referrers = state.referrers.filter(
        (referrer) => referrer.id !== deletetedReferrerId,
      );
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to delete referrer';
      } else {
        state.error = 'Failed to delete referrer';
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

export const selectRecords = (state: State) => state.referrers;
export const selectStatus = (state: State) => state.referrers.status;
export const selectError = (state: State) => state.referrers.error;
export const selectSuccessMessage = (state: State) =>
  state.referrers.successMessage;
export default referrerSlice.reducer;
