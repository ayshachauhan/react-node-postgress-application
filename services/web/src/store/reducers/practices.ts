import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PracticesGetInterface } from '@store/requests/practices';

import { indexBy } from '@root/utils/index';
import {
  addPractice,
  deletePractice,
  editPractice,
  getPracticeData,
  getPractices,
} from '../requests/practices';
import { EntityLoadingState, PracticeState } from '../types';

const initialState: PracticeState = {
  processing: false,
  entities: {},
  practiceInfo: null,
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const practiceSlice = createSlice({
  name: 'practices',
  initialState,
  reducers: {
    addPracticeItem(state, action: PayloadAction<PracticesGetInterface>) {
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id!]: action.payload },
      };
    },
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
        state.errorMessage = 'No practices found.';
      }
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
      state.processing = false;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch practices.';
      } else {
        state.errorMessage = 'Failed to fetch practices.';
      }
      state.processing = false;
    });
    builder.addCase(getPracticeInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(getPracticeInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.practiceInfo = action.payload;
    });

    builder.addCase(getPracticeInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch practice.';
      } else {
        state.errorMessage = 'Failed to fetch practice.';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      //@ts-expect-error types not clear yet
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'Practice added successfully.';
      state.processing = false;
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add practice.';
      } else {
        state.errorMessage = 'Failed to add practice.';
      }
    });
    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.IDLE;
      const deletedPracticeId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletedPracticeId]: deletedPractice,
        ...remainingPractices
      } = state.entities;
      state.entities = remainingPractices;
      state.successMessage = 'Practice deleted successfully.';
      state.processing = false;
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete practice.';
      } else {
        state.errorMessage = 'Failed to delete practice.';
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
      state.successMessage = 'Practice updated successfully.';
      state.processing = false;
    });

    builder.addCase(updateRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to update practice.';
      } else {
        state.errorMessage = 'Failed to update practice.';
      }
      state.processing = false;
    });
  },
});

export const { addPracticeItem, clearSuccessMessage, clearErrorMessage } =
  practiceSlice.actions;

export const fetchListings = createAsyncThunk(
  'practices/fetchListings',
  getPractices,
);

export const addRecordAsync = createAsyncThunk(
  'practice/addRecordAsync',
  addPractice,
);

export const updateRecordAsync = createAsyncThunk(
  'practice/editRecordAsync',
  editPractice,
);

export const deleteRecordAsync = createAsyncThunk(
  'practice/deleteRecordAsync',
  deletePractice,
);

export const getPracticeInfo = createAsyncThunk(
  'practices/getPracticeInfo',
  getPracticeData,
);

export default practiceSlice.reducer;
