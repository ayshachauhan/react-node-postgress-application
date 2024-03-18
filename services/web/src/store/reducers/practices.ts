import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPractices } from '../requests/practices';

// todo add api call and move type to appropriate folder

type Practices = {
  id: string;
  name: string;
  dateCreated: Date;
  dateUpdated: Date;
};

export interface PracticeState {
  isProcessing: boolean;
  entities: Record<string, Practices>;
  practices: Practices[];
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
      state.error = action.payload ?? 'Failed to fetch practices';
    });
  },
});

export const fetchListings = createAsyncThunk(
  'practices/fetchListings',
  getPractices,
);

export const selectRecords = (state) => state.practices;
export const selectStatus = (state) => state.practices.status;
export const selectError = (state) => state.practices.error;

export default practiceSlice.reducer;
