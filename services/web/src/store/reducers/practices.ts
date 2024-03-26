import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  PracticeCreateInterface,
  PracticesGetInterface,
} from '@root/components/practices/types';
import { State } from '@root/store';
import {
  addPractice,
  deletePractice,
  editPractice,
  getPractices,
} from '../requests/practices';

export interface PracticeState {
  isProcessing: boolean;
  entities: Record<string, PracticeCreateInterface>;
  practices: PracticesGetInterface[];
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: PracticeState = {
  isProcessing: false,
  entities: {},
  practices: [],
  status: 'idle',
  successMessage: null,
  error: null,
};

const practiceSlice = createSlice({
  name: 'practices',
  initialState,
  reducers: {
    addPracticeItem(state, action: PayloadAction<PracticeCreateInterface>) {
      state.practices = [...state.practices, action.payload];
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearErrorMessage(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListings.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = 'idle';
      state.practices = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch practices';
      } else {
        state.error = 'Failed to fetch practices';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.practices = [...state.practices, action.payload];
      state.successMessage = 'Record added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to add video';
      } else {
        state.error = 'Failed to add video';
      }
    });
    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.status = 'idle';
      const deletedPracticeId = action?.meta?.arg?.id;
      state.practices = state.practices.filter(
        (user) => user.id !== deletedPracticeId,
      );
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to delete practice';
      } else {
        state.error = 'Failed to delete practice';
      }
    });

    builder.addCase(updateRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(updateRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      const updatedPractice = action.payload;
      const updatedPractices = state.practices.map((practice) => {
        if (practice.id === updatedPractice.id) {
          return updatedPractice;
        }
        return practice;
      });

      state.practices = updatedPractices;
      state.successMessage = 'Record updated successfully';
    });

    builder.addCase(updateRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to update practice';
      } else {
        state.error = 'Failed to update practice';
      }
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

export const selectRecords = (state: State) => state.practices;
export const selectStatus = (state: State) => state.practices.status;
export const selectError = (state: State) => state.practices.error;
export const selectSuccessMessage = (state: State) =>
  state.practices.successMessage;

export default practiceSlice.reducer;
