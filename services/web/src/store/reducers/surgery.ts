import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import { indexBy } from '@root/utils';
import {
  addSurgery,
  deleteSurgery,
  getSurgeries,
  getSurgeryInfo,
} from '@store/requests/surgery';
import { EntityLoadingState, SurgeryState } from 'src/store/types';

const initialState: SurgeryState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  surgeryInfo: null,
};

const surgeriesSlicer = createSlice({
  name: 'surgeries',
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
        state.errorMessage = action.payload ?? 'Failed to fetch records';
      } else {
        state.errorMessage = 'Failed to fetch records';
      }
    });
    builder.addCase(fetchSurgeryTypeInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchSurgeryTypeInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.surgeryInfo = action.payload;
    });

    builder.addCase(fetchSurgeryTypeInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch record info';
      } else {
        state.errorMessage = 'Failed to fetch record info';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(addRecordAsync.fulfilled, (state) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {
        ...state.entities,
      };
      state.successMessage = 'Record added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add  record';
      } else {
        state.errorMessage = 'Failed to add record';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deletedSurgeryId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletedSurgeryId]: deletedInsuranceType,
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
        state.errorMessage = 'Failed to delete surgery type';
      }
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } =
  surgeriesSlicer.actions;

export const fetchListings = createAsyncThunk(
  'surgery/fetchListings',
  getSurgeries,
);

export const fetchSurgeryTypeInfo = createAsyncThunk(
  'surgery/fetchSurgeryTypeInfo',
  getSurgeryInfo,
);

export const addRecordAsync = createAsyncThunk(
  'surgery/addRecordAsync',
  addSurgery,
);

export const deleteRecordAsync = createAsyncThunk(
  'surgery/deleteRecordAsync',
  deleteSurgery,
);

export const selectRecords = (state: State) => state.surgeries;
export const selectStatus = (state: State) => state.surgeries.status;
export const selectErrorMessage = (state: State) =>
  state.surgeries.errorMessage;
export const selectSuccessMessage = (state: State) =>
  state.surgeries.successMessage;
export default surgeriesSlicer.reducer;
