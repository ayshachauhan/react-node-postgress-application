import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import {
  InsuranceTypeResponse,
  addInsuranceType,
  deleteInsuranceType,
  getInsuranceTypeInfo,
  getInsuranceTypes,
} from '../requests/insuranceTypes';

type EmptyObject = Record<string, never>;

export interface InsuranceTypeState {
  isProcessing: boolean;
  entities: Record<string, InsuranceTypeResponse>;
  insuranceTypes: InsuranceTypeResponse[];
  insuranceTypeInfo: InsuranceTypeResponse | EmptyObject;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: InsuranceTypeState = {
  isProcessing: false,
  entities: {},
  insuranceTypes: [],
  insuranceTypeInfo: {},
  status: 'idle',
  successMessage: null,
  error: null,
};

const insuranceTypesSlice = createSlice({
  name: 'insuranceTypes',
  initialState,
  reducers: {
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
      state.insuranceTypes = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch users';
      } else {
        state.error = 'Failed to fetch users';
      }
    });
    builder.addCase(fetchSurgeryTypeInfo.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(fetchSurgeryTypeInfo.fulfilled, (state, action) => {
      state.status = 'idle';
      state.insuranceTypeInfo = action.payload;
    });

    builder.addCase(fetchSurgeryTypeInfo.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch user info';
      } else {
        state.error = 'Failed to fetch surgery type info';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.insuranceTypes = [...state.insuranceTypes, action.payload];
      state.successMessage = 'Record added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to add surgery type';
      } else {
        state.error = 'Failed to add surgery type';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      const deletedSurgeryTypeId = action?.meta?.arg?.id;
      state.insuranceTypes = state.insuranceTypes.filter(
        (type) => type.id !== deletedSurgeryTypeId,
      );
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to delete surgery type';
      } else {
        state.error = 'Failed to delete surgery type';
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

export const fetchSurgeryTypeInfo = createAsyncThunk(
  'insuranceTypes/fetchSurgeryTypeInfo',
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

export const selectRecords = (state: State) => state.insuranceTypes;
export const selectStatus = (state: State) => state.insuranceTypes.status;
export const selectError = (state: State) => state.insuranceTypes.error;
export const selectSuccessMessage = (state: State) =>
  state.insuranceTypes.successMessage;
export default insuranceTypesSlice.reducer;
