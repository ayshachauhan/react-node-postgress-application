import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MediaInterface } from '@root/components/media/types';
import { addMedia } from '../requests/addMedia';
import { getMedia } from '../requests/media';

export interface MediaState {
  isProcessing: boolean;
  entities: Record<string, MediaInterface>;
  media: MediaInterface[];
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: MediaState = {
  isProcessing: false,
  entities: {},
  media: [],
  status: 'idle',
  successMessage: null, // Initial value for success message
  error: null,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addMediaItem(state, action: PayloadAction<MediaInterface>) {
      state.media = [...state.media, action.payload];
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
      state.media = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Failed to fetch videos';
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.media = [...state.media, action.payload];
      state.successMessage = 'Record added successfully'; // Set success message
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Failed to add video';
    });
  },
});

export const { addMediaItem, clearSuccessMessage, clearErrorMessage } =
  mediaSlice.actions;

export const fetchListings = createAsyncThunk('media/fetchListings', getMedia);

export const addRecordAsync = createAsyncThunk(
  'media/addRecordAsync',
  addMedia,
);

export const selectRecords = (state) => state.media;
export const selectStatus = (state) => state.media.status;
export const selectError = (state) => state.media.error;
export const selectSuccessMessage = (state) => state.media.successMessage; // Export selectSuccessMessage selector

export default mediaSlice.reducer;
