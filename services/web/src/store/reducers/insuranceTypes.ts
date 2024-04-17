import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import {
  addInsuranceType,
  deleteInsuranceType,
  getInsuranceTypeInfo,
  getInsuranceTypes,
} from 'src/store/requests/insuranceTypes';
import { EntityLoadingState, InsuranceTypeState } from 'src/store/types';

const initialState: InsuranceTypeState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  insuranceTypeInfo: null,
};

const insuranceTypesSlice = createSlice({
  name: 'insuranceTypes',
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
          action.payload ?? 'Failed to fetch insurance types';
      } else {
        state.errorMessage = 'Failed to fetch insurance types';
      }
      state.processing = false;
    });
    builder.addCase(fetchInsuranceTypeInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchInsuranceTypeInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.insuranceTypeInfo = action.payload;
    });

    builder.addCase(fetchInsuranceTypeInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch user info';
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
        state.errorMessage = action.payload ?? 'Failed to add insurance type';
      } else {
        state.errorMessage = 'Failed to add insurance type';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deleteInsuranceTypeId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deleteInsuranceTypeId]: deletedInsuranceType,
        ...remainingRecord
      } = state.entities;
      state.entities = remainingRecord;
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage =
          action.payload ?? 'Failed to delete insurance type';
      } else {
        state.errorMessage = 'Failed to delete insurance type';
      }
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } =
  insuranceTypesSlice.actions;

export const fetchListings = createAsyncThunk(
  'insuranceTypes/fetchListings',
  getInsuranceTypes,
);

export const fetchInsuranceTypeInfo = createAsyncThunk(
  'insuranceTypes/fetchInsuranceTypeInfo',
  getInsuranceTypeInfo,
);

export const addRecordAsync = createAsyncThunk(
  'insuranceTypes/addRecordAsync',
  addInsuranceType,
);

export const deleteRecordAsync = createAsyncThunk(
  'insuranceTypes/deleteRecordAsync',
  deleteInsuranceType,
);

export default insuranceTypesSlice.reducer;
