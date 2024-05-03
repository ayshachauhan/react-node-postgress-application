import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import {
  addSurgeryConfiguration,
  deleteSurgeryConfiguration,
  editSurgeryConfiguration,
  getSurgeryConfigurationInfo,
  getSurgeryConfigurations,
} from '@root/store/requests/surgeryConfiguration';
import { indexBy } from '@root/utils';
import { EntityLoadingState, SurgeryConfigurationState } from 'src/store/types';

const initialState: SurgeryConfigurationState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  surgeryConfigurationInfo: null,
};

const surgeryConfigurationsSlice = createSlice({
  name: 'surgeryConfigurations',
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
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage =
          action.payload ?? 'Failed to fetch surgery configurations';
      } else {
        state.errorMessage = 'Failed to fetch surgery configurations';
      }
    });
    builder.addCase(fetchSurgeryConfigurationInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(
      fetchSurgeryConfigurationInfo.fulfilled,
      (state, action) => {
        state.status = EntityLoadingState.SUCCEEDED;
        state.surgeryConfigurationInfo = action.payload;
      },
    );

    builder.addCase(fetchSurgeryConfigurationInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage =
          action.payload ?? 'Failed to fetch surgery configuration info';
      } else {
        state.errorMessage = 'Failed to fetch surgery configuration info';
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
        state.errorMessage = action.payload ?? 'Failed to add surgery type';
      } else {
        state.errorMessage = 'Failed to add surgery type';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deletedSurgeryConfigId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletedSurgeryConfigId]: deletedSurgeryConfig,
        ...remainingRecord
      } = state.entities;
      state.entities = remainingRecord;
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete surgery type';
      } else {
        state.errorMessage = 'Failed to update surgery type';
      }
    });

    //edit surgeryConfig
    builder.addCase(editRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(editRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;

      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'Record updated successfully';
    });

    builder.addCase(editRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete surgery type';
      } else {
        state.errorMessage = 'Failed to delete surgery config';
      }
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } =
  surgeryConfigurationsSlice.actions;

export const fetchListings = createAsyncThunk(
  'surgeryConfigurations/fetchSurgeryConfigurations',
  getSurgeryConfigurations,
);

export const fetchSurgeryConfigurationInfo = createAsyncThunk(
  'surgeryConfigurations/fetchSurgeryConfigurationInfo',
  getSurgeryConfigurationInfo,
);

export const addRecordAsync = createAsyncThunk(
  'surgeryConfigurations/addRecordAsync',
  addSurgeryConfiguration,
);

export const editRecordAsync = createAsyncThunk(
  'surgeryConfigurations/editRecordAsync',
  editSurgeryConfiguration,
);

export const deleteRecordAsync = createAsyncThunk(
  'surgeryConfigurations/deleteRecordAsync',
  deleteSurgeryConfiguration,
);

export const selectRecords = (state: State) => state.surgeryConfigurations;
export const selectStatus = (state: State) =>
  state.surgeryConfigurations.status;
export const selectError = (state: State) =>
  state.surgeryConfigurations.errorMessage;
export const selectSuccessMessage = (state: State) =>
  state.surgeryConfigurations.successMessage;
export default surgeryConfigurationsSlice.reducer;
