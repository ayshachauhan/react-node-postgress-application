import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addMedia } from '../requests/addMedia';
import { getMedia } from '../requests/media';

// todo add api call and move type to appropriate folder

type Media = {
  id: string;
  name: string;
  urlEmbed: string;
  url: string;
  dateCreated: Date;
  dateUpdated: Date;
};

export interface MediaState {
  isProcessing: boolean;
  entities: Record<string, Media>;
  media: Media[];
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
    addMediaItem(state, action: PayloadAction<Record>) {
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
  'records/addRecordAsync',
  addMedia,
);

export const selectRecords = (state) => state.media;
export const selectStatus = (state) => state.media.status;
export const selectError = (state) => state.media.error;
export const selectSuccessMessage = (state) => state.media.successMessage; // Export selectSuccessMessage selector

export default mediaSlice.reducer;
