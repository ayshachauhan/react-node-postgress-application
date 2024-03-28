import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from '@root/store';
import {
  addTemplate,
  CreateTemplateResponse,
  getTemplates,
  GetTemplatesResponse,
} from '../requests/templates';

export interface MediaState {
  isProcessing: boolean;
  entities: Record<string, GetTemplatesResponse>;
  template: GetTemplatesResponse[];
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: MediaState = {
  isProcessing: false,
  entities: {},
  template: [],
  status: 'idle',
  successMessage: null,
  error: null,
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    addMediaItem(state, action: PayloadAction<CreateTemplateResponse>) {
      state.template = [...state.template, action.payload];
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
      state.template = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch videos';
      } else {
        state.error = 'Failed to fetch videos';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.template = [...state.template, action.payload];
      state.successMessage = 'Record added successfully';
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
  templateSlice.actions;

export const fetchListings = createAsyncThunk(
  'template/fetchListings',
  getTemplates,
);

export const addRecordAsync = createAsyncThunk(
  'template/addRecordAsync',
  addTemplate,
);

export const selectRecords = (state: State) => state.templates;
export const selectStatus = (state: State) => state.templates.status;
export const selectError = (state: State) => state.templates.error;
export const selectSuccessMessage = (state: State) =>
  state.templates.successMessage;

export default templateSlice.reducer;
