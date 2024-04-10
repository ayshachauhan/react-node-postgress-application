import { IMedia } from '@backend/entities';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from '@root/store';
import { indexBy } from '../../utils/index';
import { addMedia, getMedia } from '../requests/media';
import { EntitiesState, EntityLoadingState } from '../types';
const initialState: EntitiesState<IMedia> = {
  entities: {},
  status: EntityLoadingState.IDLE,
  processing: false,
  successMessage: undefined,
  errorMessage: undefined,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addMediaItem(
      { entities }: EntitiesState<IMedia>,
      action: PayloadAction<IMedia>,
    ) {
      entities = {
        ...entities,
        ...indexBy('id', [action.payload]),
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

    builder.addCase(fetchListings.fulfilled, ({ status, entities }, action) => {
      status = EntityLoadingState.SUCCEEDED;
      entities = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch videos';
      } else {
        state.errorMessage = 'Failed to fetch videos';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.media = [...state.media, action.payload];
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
