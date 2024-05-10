import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addTemplate,
  deleteTemplate,
  getTemplates,
  updateTemplate,
} from '../requests/templates';
import { EntityLoadingState, TemplateState } from '../types';

const initialState: TemplateState = {
  processing: false,
  entities: {},
  templateInfo: null,
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
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
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {};
      if (action.payload.length === 0) {
        state.errorMessage = 'No records found';
      } else {
        state.errorMessage = undefined;
      }
      if (action.payload) {
        const indexedEntities = action.payload.reduce((acc, obj) => {
          const surgeryTypeName = obj.surgeryTypeName;
          delete obj.surgeryTypeName;
          if (surgeryTypeName) {
            acc[surgeryTypeName] = {
              ...obj,
              surgeryTypeName: surgeryTypeName,
            };
          }
          return acc;
        }, {});

        state.entities = {
          ...state.entities,
          ...indexedEntities,
        };
      }
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      state.processing = false;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch templates';
      } else {
        state.errorMessage = 'Failed to fetch templates';
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
      state.successMessage = 'Record added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add template';
      } else {
        state.errorMessage = 'Failed to add template';
      }
      state.processing = false;
    });

    builder.addCase(updateRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(updateRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'Record updated successfully';
    });

    builder.addCase(updateRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to update template';
      } else {
        state.errorMessage = 'Failed to update template';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deletetedTemplateId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletetedTemplateId]: deletedTemplate,
        ...remainingTemplates
      } = state.entities;
      state.entities = remainingTemplates;
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete template';
      } else {
        state.errorMessage = 'Failed to delete template';
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

export default templateSlice.reducer;
