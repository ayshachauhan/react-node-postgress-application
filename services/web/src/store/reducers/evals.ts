import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import { indexBy } from '@root/utils';
import {
  addEval,
  deleteEval,
  getEvalInfo,
  getEvals,
  updateEval,
} from 'src/store/requests/evals';
import { EntityLoadingState, EvalState } from 'src/store/types';

const initialState: EvalState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  evalInfo: null,
};

const evalsSlice = createSlice({
  name: 'evals',
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
        state.errorMessage = action.payload ?? 'Failed to fetch evals';
      } else {
        state.errorMessage = 'Failed to fetch evals';
      }
    });
    builder.addCase(fetchEvalInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchEvalInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.evalInfo = action.payload;
    });

    builder.addCase(fetchEvalInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch eval info';
      } else {
        state.errorMessage = 'Failed to fetch eval info';
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
        state.errorMessage = action.payload ?? 'Failed to delete surgery type';
      } else {
        state.errorMessage = 'Failed to delete surgery type';
      }
    });

    //update cases
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
  },
});
export const { clearSuccessMessage, clearErrorMessage } = evalsSlice.actions;

export const fetchListings = createAsyncThunk('eval/fetchListings', getEvals);

export const fetchEvalInfo = createAsyncThunk(
  'eval/fetchSurgeryTypeInfo',
  getEvalInfo,
);

export const updateRecordAsync = createAsyncThunk(
  'eval/updateRecordAsync',
  updateEval,
);

export const addRecordAsync = createAsyncThunk('eval/addRecordAsync', addEval);

export const deleteRecordAsync = createAsyncThunk(
  'eval/deleteRecordAsync',
  deleteEval,
);

export const selectRecords = (state: State) => state.evals;
export const selectStatus = (state: State) => state.evals.status;
export const selectErrorMessage = (state: State) => state.evals.errorMessage;
export const selectSuccessMessage = (state: State) =>
  state.evals.successMessage;
export default evalsSlice.reducer;
