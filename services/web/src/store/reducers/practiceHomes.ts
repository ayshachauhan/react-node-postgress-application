import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import {
  PracticeHomeResponse,
  addPracticeHome,
  deletePracticeHome,
  getPracticeHomeInfo,
  getPracticeHomes,
} from '../requests/practiceHomes';

type EmptyObject = Record<string, never>;

export interface practiceHomeState {
  isProcessing: boolean;
  entities: Record<string, PracticeHomeResponse>;
  practiceHomes: PracticeHomeResponse[];
  SurgeryTypeInfo: PracticeHomeResponse | EmptyObject;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: practiceHomeState = {
  isProcessing: false,
  entities: {},
  practiceHomes: [],
  SurgeryTypeInfo: {},
  status: 'idle',
  successMessage: null,
  error: null,
};

const practiceHomeSlice = createSlice({
  name: 'practiceHomes',
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
      state.practiceHomes = action.payload;
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
        state.error = 'Failed to fetch practice home info';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.practiceHomes = [...state.practiceHomes, action.payload];
      state.successMessage = 'Record added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to add practice home';
      } else {
        state.error = 'Failed to add practice home';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      const deletedSurgeryTypeId = action?.meta?.arg?.id;
      state.practiceHomes = state.practiceHomes.filter(
        (type) => type.id !== deletedSurgeryTypeId,
      );
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to delete practice home';
      } else {
        state.error = 'Failed to delete practice home';
      }
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } =
  practiceHomeSlice.actions;

export const fetchListings = createAsyncThunk(
  'practiceHomes/fetchListings',
  getPracticeHomes,
);

export const fetchSurgeryTypeInfo = createAsyncThunk(
  'surgerTypes/fetchSurgeryTypeInfo',
  getPracticeHomeInfo,
);

export const addRecordAsync = createAsyncThunk(
  'surgerTypes/addRecordAsync',
  addPracticeHome,
);

export const deleteRecordAsync = createAsyncThunk(
  'surgerTypes/deleteRecordAsync',
  deletePracticeHome,
);

export const selectRecords = (state: State) => state.practiceHomes;
export const selectStatus = (state: State) => state.practiceHomes.status;
export const selectError = (state: State) => state.practiceHomes.error;
export const selectSuccessMessage = (state: State) =>
  state.practiceHomes.successMessage;
export default practiceHomeSlice.reducer;
