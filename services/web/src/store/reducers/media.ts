import { IMedia } from '@packages/entities';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from '@root/store';
import { addMedia, getMedia, MediaInterface } from '../requests/media';

export interface MediaState {
  isProcessing: boolean;
  entities: Record<string, MediaInterface>;
  media: MediaInterface[];
  status: 'idle' | 'loading' | 'failed';
  successMessage: string;
  error: string;
}

const initialState: MediaState = {
  isProcessing: false,
  entities: {},
  media: [],
  status: 'idle',
  successMessage: '', // Initial value for success message
  error: '',
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addMediaItem(state: EntitiesState<IMedia>, action: PayloadAction<IMedia>) {
      state.entities = {
        ...state.entities,
        [action.payload.id]: action.payload,
      };
    },
    clearSuccessMessage(state) {
      state.successMessage = '';
    },
    clearErrorMessage(state) {
      state.error = '';
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListings.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = 'idle';
      if (action.payload.length === 0) {
        state.error = 'No records found';
      } else {
        state.error = '';
      }
      state.media = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch videos';
      } else {
        state.errorMessage = 'Failed to fetch videos';
      }
      state.media = [];
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {
        ...state.entities,
        [action.payload.id]: action.payload,
      };
      state.successMessage = 'Record added successfully';
      state.processing = false;
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add video';
      } else {
        state.errorMessage = 'Failed to add video';
      }
      state.processing = false;
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

export const selectRecords = (state: State) => state.media;
export const selectStatus = (state: State) => state.media.status;
export const selectError = (state: State) => state.media.errorMessage;
export const selectSuccessMessage = (state: State) =>
  state.media.successMessage; // Export selectSuccessMessage selector

export default mediaSlice.reducer;
