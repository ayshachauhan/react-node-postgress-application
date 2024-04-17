import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import {
  EvalResponse,
  addEval,
  deleteEval,
  getEvalInfo,
  getEvals,
} from '../requests/evals';

type EmptyObject = Record<string, never>;

export interface EvalState {
  isProcessing: boolean;
  entities: Record<string, EvalResponse>;
  evals: EvalResponse[];
  evalInfo: EvalResponse | EmptyObject;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: EvalState = {
  isProcessing: false,
  entities: {},
  evals: [],
  evalInfo: {},
  status: 'idle',
  successMessage: null,
  error: null,
};

const evalsSlice = createSlice({
  name: 'evals',
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
      state.evals = action.payload;
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
      state.evalInfo = action.payload;
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
      state.evals = [...state.evals, action.payload];
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
      const deleteEval = action?.meta?.arg?.id;
      state.evals = state.evals.filter((type) => type.id !== deleteEval);
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
export const { clearSuccessMessage, clearErrorMessage } = evalsSlice.actions;

export const fetchListings = createAsyncThunk('eval/fetchListings', getEvals);

export const fetchSurgeryTypeInfo = createAsyncThunk(
  'eval/fetchSurgeryTypeInfo',
  getEvalInfo,
);

export const addRecordAsync = createAsyncThunk('eval/addRecordAsync', addEval);

export const deleteRecordAsync = createAsyncThunk(
  'eval/deleteRecordAsync',
  deleteEval,
);

export const selectRecords = (state: State) => state.evals;
export const selectStatus = (state: State) => state.evals.status;
export const selectError = (state: State) => state.evals.error;
export const selectSuccessMessage = (state: State) =>
  state.evals.successMessage;
export default evalsSlice.reducer;
