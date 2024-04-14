import { IMedia } from '@packages/entities/media';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import { addMedia, getMedia } from '../requests/media';
import { EntitiesState, EntityLoadingState } from '../types';

const initialState: EntitiesState<IMedia> = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined, // Initial value for success message
  errorMessage: undefined,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    addMediaItem(state, action: PayloadAction<IMedia>) {
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
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

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = EntityLoadingState.IDLE;
      if (action.payload.length === 0) {
        state.errorMessage = 'No records found';
      }
      state.entities = { ...state.entities, ...indexBy('id', action.payload) };
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      state.processing = false;
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
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'Record added successfully'; // Set success message
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

export default mediaSlice.reducer;
