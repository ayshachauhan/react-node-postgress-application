import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import {
  addWaitlist,
  deleteWaitlist,
  getWaitlist,
  getWaitlistInfo,
} from '../../store/requests/waitlist';
import { EntityLoadingState, WaitlistState } from '../../store/types';

const initialState: WaitlistState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  waitlistInfo: null,
};

const waitlistSlice = createSlice({
  name: 'waitlist',
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
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch waitlists';
      } else {
        state.errorMessage = 'Failed to fetch waitlists';
      }
      state.processing = false;
    });
    builder.addCase(fetchWaitlistInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchWaitlistInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.waitlistInfo = action.payload;
    });

    builder.addCase(fetchWaitlistInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch waitlist info';
      } else {
        state.errorMessage = 'Failed to fetch waitlist info';
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
      state.successMessage = 'Waitlist added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add waitlist';
      } else {
        state.errorMessage = 'Failed to add waitlist';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const waitlistId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [waitlistId]: deleteWaitlist,
        ...remainingRecord
      } = state.entities;
      state.entities = remainingRecord;
      state.successMessage = 'Waitlist deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete waitlist';
      } else {
        state.errorMessage = 'Failed to delete waitlist';
      }
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } = waitlistSlice.actions;

export const fetchListings = createAsyncThunk(
  'waitlist/fetchListings',
  getWaitlist,
);

export const fetchWaitlistInfo = createAsyncThunk(
  'waitlist/fetchWaitlistInfo',
  getWaitlistInfo,
);

export const addRecordAsync = createAsyncThunk(
  'waitlist/addRecordAsync',
  addWaitlist,
);

export const deleteRecordAsync = createAsyncThunk(
  'waitlist/deleteRecordAsync',
  deleteWaitlist,
);

export default waitlistSlice.reducer;
