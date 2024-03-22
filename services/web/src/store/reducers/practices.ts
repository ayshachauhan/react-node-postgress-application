import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  PracticeCreateInterface,
  PracticesGetInterface,
} from '@root/components/practices/types';
import { State } from '@root/store';
import {
  addPractice,
  getPracticeData,
  getPractices,
} from '../requests/practices';

type EmptyObject = Record<string, never>;

export interface PracticeState {
  isProcessing: boolean;
  entities: Record<string, PracticeCreateInterface>;
  practices: PracticesGetInterface[];
  practiceInfo: PracticesInterface | EmptyObject;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: PracticeState = {
  isProcessing: false,
  entities: {},
  practices: [],
  practiceInfo: {},
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
    builder.addCase(getPracticeInfo.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(getPracticeInfo.fulfilled, (state, action) => {
      state.status = 'idle';
      state.practiceInfo = action.payload;
    });

    builder.addCase(getPracticeInfo.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch practice';
      } else {
        state.error = 'Failed to fetch practice';
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
        state.error = action.payload ?? 'Failed to add practice';
      } else {
        state.error = 'Failed to add practice';
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

export const getPracticeInfo = createAsyncThunk(
  'practices/getPracticeInfo',
  getPracticeData,
);
export const selectRecords = (state: State) => state.practices;
export const selectStatus = (state: State) => state.practices.status;
export const selectError = (state: State) => state.practices.error;
export const selectPracticeInfo = (state: State) => {
  if (state.practices && state.practices.practiceInfo) {
    return state.practices.practiceInfo.name;
  }
  return '';
};
export const selectSuccessMessage = (state: State) =>
  state.practices.successMessage;

export default practiceSlice.reducer;
