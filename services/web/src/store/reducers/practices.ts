import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PracticesInterface } from '@root/components/practices/types';
import { State } from '@root/store';
import { getPractices } from '../requests/practices';

export interface PracticeState {
  isProcessing: boolean;
  entities: Record<string, PracticesInterface>;
  practices: PracticesInterface[];
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
  reducers: {},
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
  },
});

export const fetchListings = createAsyncThunk(
  'practices/fetchListings',
  getPractices,
);

export const selectRecords = (state: State) => state.practices;
export const selectStatus = (state: State) => state.practices.status;
export const selectError = (state: State) => state.practices.error;

export default practiceSlice.reducer;
