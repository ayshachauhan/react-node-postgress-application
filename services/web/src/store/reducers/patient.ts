import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import { indexBy } from '@root/utils';
import { getPatients } from '@store/requests/patients';
import { EntityLoadingState, PatientState } from 'src/store/types';

const initialState: PatientState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  patientInfo: null,
};

const patientsSlicer = createSlice({
  name: 'patients',
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
      state.entities = {};
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } =
  patientsSlicer.actions;

export const fetchListings = createAsyncThunk(
  'patients/fetchListings',
  getPatients,
);
export const selectRecords = (state: State) => state.surgeries;
export const selectStatus = (state: State) => state.surgeries.status;
export const selectErrorMessage = (state: State) =>
  state.surgeries.errorMessage;
export const selectSuccessMessage = (state: State) =>
  state.surgeries.successMessage;
export default patientsSlicer.reducer;
