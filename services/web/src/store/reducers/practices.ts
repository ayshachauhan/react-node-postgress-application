import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  PracticeCreateInterface,
  PracticesGetInterface,
} from '@root/components/practices/types';
import { State } from '@root/store';
import { addPractice, editPractice, getPractices } from '../requests/practices';

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
  successMessage: null, // Initial value for success message
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
      state.successMessage = 'Record added successfully'; // Set success message
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to add video';
      } else {
        state.error = 'Failed to add video';
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

export const selectRecords = (state: State) => state.practices;
export const selectStatus = (state: State) => state.practices.status;
export const selectError = (state: State) => state.practices.error;
export const selectSuccessMessage = (state: State) =>
  state.practices.successMessage;

export default practiceSlice.reducer;
