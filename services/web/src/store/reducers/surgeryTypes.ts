import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import { indexBy } from '@root/utils';
import {
  addSurgeryType,
  deleteSurgeryType,
  getSurgeryTypeInfo,
  getSurgeryTypes,
} from 'src/store/requests/surgeryTypes';
import { EntityLoadingState, SurgeryTypeState } from 'src/store/types';

const initialState: SurgeryTypeState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  surgeryTypeInfo: null,
};

const surgeryTypeSlice = createSlice({
  name: 'surgeryTypes',
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
        state.errorMessage = action.payload ?? 'Failed to fetch surgery types';
      } else {
        state.errorMessage = 'Failed to fetch surgery types';
      }
    });
    builder.addCase(fetchSurgeryTypeInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchSurgeryTypeInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.surgeryTypeInfo = action.payload;
    });

    builder.addCase(fetchSurgeryTypeInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage =
          action.payload ?? 'Failed to fetch surgery type info';
      } else {
        state.errorMessage = 'Failed to fetch surgery type info';
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
      const deletedSurgeryTypeId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletedSurgeryTypeId]: deletedInsuranceType,
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
  surgeryTypeSlice.actions;

export const fetchListings = createAsyncThunk(
  'surgeryTypes/fetchSurgeryTypes',
  getSurgeryTypes,
);

export const fetchSurgeryTypeInfo = createAsyncThunk(
  'surgeryTypes/fetchSurgeryTypeInfo',
  getSurgeryTypeInfo,
);

export const addRecordAsync = createAsyncThunk(
  'surgeryTypes/addRecordAsync',
  addSurgeryType,
);

export const deleteRecordAsync = createAsyncThunk(
  'surgeryTypes/deleteRecordAsync',
  deleteSurgeryType,
);
export const selectRecords = (state: State) => state.surgeryTypes;
export const selectStatus = (state: State) => state.surgeryTypes.status;
export const selectError = (state: State) => state.surgeryTypes.errorMessage;
export const selectSuccessMessage = (state: State) =>
  state.surgeryTypes.successMessage;
export default surgeryTypeSlice.reducer;
