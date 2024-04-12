import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import {
  GetTemplatesResponse,
  addTemplate,
  deleteTemplate,
  getTemplates,
  updateTemplate,
} from '../requests/templates';

export interface TemplateState {
  isProcessing: boolean;
  entities: Record<string, string | undefined>;
  templates: GetTemplatesResponse[];
  status: 'idle' | 'loading' | 'failed';
  successMessage: string;
  error: string;
}

const initialState: TemplateState = {
  isProcessing: false,
  entities: {},
  templates: [],
  status: 'idle',
  successMessage: '',
  error: '',
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = '';
    },
    clearErrorMessage(state) {
      state.error = '';
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListings.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = 'idle';
      if (action.payload.length === 0) {
        state.error = 'No records found';
      } else {
        state.error = '';
      }
      state.templates = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch templates';
        state.error = action.payload ?? 'Failed to fetch templates';
      } else {
        state.error = 'Failed to fetch templates';
        state.error = 'Failed to fetch templates';
      }
      state.templates = [];
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.templates = [...state.templates, action.payload];
      state.successMessage = 'Record added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to add template';
      } else {
        state.error = 'Failed to add template';
      }
    });

    builder.addCase(updateRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(updateRecordAsync.fulfilled, (state) => {
      state.status = 'idle';
      state.successMessage = 'Record updated successfully'; // Set success message
    });

    builder.addCase(updateRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to update template';
      } else {
        state.error = 'Failed to update template';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state) => {
      state.status = 'idle';
      state.successMessage = 'Record deleted successfully'; // Set success message
      state.error = '';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to delete template';
      } else {
        state.error = 'Failed to delete template';
      }
    });
  },
});

export const { clearSuccessMessage, clearErrorMessage } = templateSlice.actions;

export const fetchListings = createAsyncThunk(
  'template/fetchListings',
  getTemplates,
);

export const addRecordAsync = createAsyncThunk(
  'template/addRecordAsync',
  addTemplate,
);

export const deleteRecordAsync = createAsyncThunk(
  'templates/deleteRecordAsync',
  deleteTemplate,
);

export const updateRecordAsync = createAsyncThunk(
  'templates/updateRecordAsync',
  updateTemplate,
);

export const selectRecords = (state: State) => state.templates;
export const selectStatus = (state: State) => state.templates.status;
export const selectError = (state: State) => state.templates.error;
export const selectSuccessMessage = (state: State) =>
  state.templates.successMessage;

export default templateSlice.reducer;
