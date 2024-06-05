import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import {
  addPracticeHome,
  deletePracticeHome,
  getPracticeHomeInfo,
  getPracticeHomes,
} from '@store/requests/practiceHomes';
import { EntityLoadingState, PracticeHomeState } from '../types';

const initialState: PracticeHomeState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const practiceHomeSlice = createSlice({
  name: 'practiceHomes',
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
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
      state.processing = false;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage =
          action.payload ?? 'Failed to fetch practice homes.';
      } else {
        state.errorMessage = 'Failed to fetch practice homes.';
      }
      state.processing = false;
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
      state.successMessage = 'Practice home added successfully.';
      state.processing = false;
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add practice home.';
      } else {
        state.errorMessage = 'Failed to add practice home.';
      }
      state.processing = false;
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deletedPracticeHomeId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletedPracticeHomeId]: deletedPracticeHome,
        ...remainingPracticeHomes
      } = state.entities;
      state.entities = remainingPracticeHomes;
      state.successMessage = 'Practice home deleted successfully.';
      state.processing = false;
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage =
          action.payload ?? 'Failed to delete practice home.';
      } else {
        state.errorMessage = 'Failed to delete practice home.';
      }
      state.processing = false;
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } =
  practiceHomeSlice.actions;

export const fetchListings = createAsyncThunk(
  'practiceHomes/fetchListings',
  getPracticeHomes,
);

export const fetchPracticeHomeInfo = createAsyncThunk(
  'surgerTypes/fetchPracticeHomeInfo',
  getPracticeHomeInfo,
);

export const addRecordAsync = createAsyncThunk(
  'surgerTypes/addRecordAsync',
  addPracticeHome,
);

export const deleteRecordAsync = createAsyncThunk(
  'surgerTypes/deleteRecordAsync',
  deletePracticeHome,
);

export default practiceHomeSlice.reducer;
