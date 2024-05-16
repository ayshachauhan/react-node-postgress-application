import { IHistory } from '@packages/entities/index.browser';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import { getHistory } from '../requests/history';
import { EntitiesState, EntityLoadingState } from '../types';

const initialState: EntitiesState<IHistory> = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem(state, action: PayloadAction<IHistory>) {
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
    },
    clearSuccessMessage(state) {
      state.successMessage = undefined;
    },
    clearErrorMessage(state) {
      state.errorMessage = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchHistory.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      if (action.payload.length === 0) {
        state.errorMessage = 'No records found';
      }

      //@ts-expect-error need to fix type
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });

    builder.addCase(fetchHistory.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      state.processing = false;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch history';
      } else {
        state.errorMessage = 'Failed to fetch history';
      }
    });
  },
});

export const { addHistoryItem, clearSuccessMessage, clearErrorMessage } =
  historySlice.actions;

export const fetchHistory = createAsyncThunk(
  'calendar/fetchHistory',
  getHistory,
);

export default historySlice.reducer;
