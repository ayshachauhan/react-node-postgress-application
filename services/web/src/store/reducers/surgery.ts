import { MonthOption } from '@packages/entities';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import { indexBy } from '@root/utils/index';
import {
  addSurgery,
  deleteSurgery,
  getSurgeries,
  getSurgeryInfo,
  updateSurgery,
} from '@store/requests/surgery';
import { EntityLoadingState, SurgeryState } from 'src/store/types';

const getCurrentMonthOption = (): MonthOption => {
  const currentDate = new Date();
  const monthLabel = currentDate.toLocaleString('default', { month: 'long' });
  const monthValue = currentDate.toLocaleString('default', {
    month: 'numeric',
  });
  const id = `${currentDate.getFullYear()}-${monthValue}`;

  return {
    label: monthLabel,
    value: monthValue,
    id: id,
  };
};

const initialState: SurgeryState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  surgeryInfo: null,
  surgeryFilters: {
    selectedMonth: [getCurrentMonthOption()],
    searchMRNName: null,
    selectedValue: null,
  },
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
    setSelectedMonth: (state, action) => {
      state.surgeryFilters.selectedMonth = action.payload;
    },
    setSearchMRNName: (state, action) => {
      state.surgeryFilters.searchMRNName = action.payload;
    },
    setSelectedValue: (state, action) => {
      state.surgeryFilters.selectedValue = action.payload;
    },
    setSurgeryFilters: (state, action) => {
      state.surgeryFilters = { ...state.surgeryFilters, ...action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListings.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = indexBy('id', action.payload);
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch records';
      } else {
        state.errorMessage = 'Failed to fetch records';
      }
    });

    builder.addCase(fetchSurgeryInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchSurgeryInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.surgeryInfo = action.payload;
    });

    builder.addCase(fetchSurgeryInfo.rejected, (state, action) => {
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

    builder.addCase(updateRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(updateRecordAsync.fulfilled, (state) => {
      state.status = EntityLoadingState.SUCCEEDED;

      state.successMessage = 'Record updated successfully';
    });

    builder.addCase(updateRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to update surgery.';
      } else {
        state.errorMessage = 'Failed to update surgery.';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deletedEvalId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletedEvalId]: deletedInsuranceType,
        ...remainingRecord
      } = state.entities;
      state.entities = remainingRecord;
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete surgery';
      } else {
        state.errorMessage = 'Failed to delete surgery';
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

export const fetchSurgeryInfo = createAsyncThunk(
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

export const updateRecordAsync = createAsyncThunk(
  'surgery/updateRecordAsync',
  updateSurgery,
);

export const selectRecords = (state: State) => state.surgeries;
export const selectStatus = (state: State) => state.surgeries.status;
export const selectErrorMessage = (state: State) =>
  state.surgeries.errorMessage;
export const selectSuccessMessage = (state: State) =>
  state.surgeries.successMessage;
export const {
  setSelectedMonth,
  setSearchMRNName,
  setSelectedValue,
  setSurgeryFilters,
} = surgeriesSlicer.actions;
export default surgeriesSlicer.reducer;
