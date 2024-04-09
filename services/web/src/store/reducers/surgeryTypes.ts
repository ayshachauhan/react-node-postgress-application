import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import {
  SurgeryTypeResponse,
  addSurgeryType,
  deleteSurgeryType,
  getSurgeryTypeInfo,
  getSurgeryTypes,
} from '../requests/surgeryTypes';

type EmptyObject = Record<string, never>;

export interface SurgeryTypeState {
  isProcessing: boolean;
  entities: Record<string, SurgeryTypeResponse>;
  surgeryTypes: SurgeryTypeResponse[];
  SurgeryTypeInfo: SurgeryTypeResponse | EmptyObject;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: SurgeryTypeState = {
  isProcessing: false,
  entities: {},
  surgeryTypes: [],
  SurgeryTypeInfo: {},
  status: 'idle',
  successMessage: null,
  error: null,
};

const surgeryTypeSlice = createSlice({
  name: 'surgeryTypes',
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
      state.surgeryTypes = action.payload;
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
      state.SurgeryTypeInfo = action.payload;
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
      state.surgeryTypes = [...state.surgeryTypes, action.payload];
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
      state.surgeryTypes = state.surgeryTypes.filter(
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
  surgeryTypeSlice.actions;

export const fetchListings = createAsyncThunk(
  'surgeryTypes/fetchListings',
  getSurgeryTypes,
);

export const fetchSurgeryTypeInfo = createAsyncThunk(
  'surgerTypes/fetchSurgeryTypeInfo',
  getSurgeryTypeInfo,
);

export const addRecordAsync = createAsyncThunk(
  'surgerTypes/addRecordAsync',
  addSurgeryType,
);

export const deleteRecordAsync = createAsyncThunk(
  'surgerTypes/deleteRecordAsync',
  deleteSurgeryType,
);

export const selectRecords = (state: State) => state.surgeryTypes;
export const selectStatus = (state: State) => state.surgeryTypes.status;
export const selectError = (state: State) => state.surgeryTypes.error;
export const selectSuccessMessage = (state: State) =>
  state.surgeryTypes.successMessage;
export default surgeryTypeSlice.reducer;
