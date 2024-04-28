import { ICalendar } from '@packages/entities/index.browser';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import { createCalendar, getCalendars } from '../requests/calendar/api';
import { EntitiesState, EntityLoadingState } from '../types';

const initialState: EntitiesState<ICalendar> = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    addCalendarItem(state, action: PayloadAction<ICalendar>) {
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
    builder.addCase(fetchCalendars.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchCalendars.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      if (action.payload.length === 0) {
        state.errorMessage = 'No records found';
      }
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });

    builder.addCase(fetchCalendars.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      state.processing = false;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch calendars';
      } else {
        state.errorMessage = 'Failed to fetch calndars';
      }
    });

    builder.addCase(createCalendarEntry.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(createCalendarEntry.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'Calendar added successfully';
    });

    builder.addCase(createCalendarEntry.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add Calendar';
      } else {
        state.errorMessage = 'Failed to add calendar';
      }
      state.processing = false;
    });
  },
});

export const { addCalendarItem, clearSuccessMessage, clearErrorMessage } =
  calendarSlice.actions;

export const fetchCalendars = createAsyncThunk(
  'calendar/fetchCalendars',
  getCalendars,
);

export const createCalendarEntry = createAsyncThunk(
  'calendar/createCalendarEntry',
  createCalendar,
);

export default calendarSlice.reducer;
