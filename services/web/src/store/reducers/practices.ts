import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPractices } from '../requests/practices';

// todo add api call and move type to appropriate folder

type Practice = {
  id: string;
  name: string;
  dateCreated: Date;
  dateUpdated: Date;
};

export interface PracticeState {
  isProcessing: boolean;
  entities: Record<string, Practice>;
  media: Practice[];
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: PracticeState = {
  isProcessing: false,
  entities: {},
  media: [],
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
      state.media = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Failed to fetch videos';
    });
  },
});

export const fetchListings = createAsyncThunk(
  'practices/fetchListings',
  getPractices,
);

export const selectRecords = (state) => state.media;
export const selectStatus = (state) => state.media.status;
export const selectError = (state) => state.media.error;

export default practiceSlice.reducer;
