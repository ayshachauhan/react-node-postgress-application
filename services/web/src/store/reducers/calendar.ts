import { CalendarEntity } from '@packages/entities';
import { ICalendar } from '@packages/entities/index.browser';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import {
  createCalendar,
  getCalendars,
  getFilteredCalendars,
  updateCalendars,
} from '../requests/calendar/api';
import { EntitiesState, EntityLoadingState } from '../types';

interface EntitiesStateWithRestricted<T> extends EntitiesState<T> {
  restricted: boolean;
  calendarsWithoutPermission: CalendarEntity[];
}

const initialState: EntitiesStateWithRestricted<ICalendar> = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  restricted: false,
  calendarsWithoutPermission: [],
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
      state.entities = {};
      if (action.payload.length === 0) {
        state.errorMessage = 'No records found.';
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
        state.errorMessage = action.payload ?? 'Failed to fetch calendars.';
      } else {
        state.errorMessage = 'Failed to fetch calendars.';
      }
    });

    builder.addCase(fetchFilteredCalendars.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchFilteredCalendars.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {};
      state.entities = indexBy('id', action.payload.calendars);
      state.calendarsWithoutPermission =
        action.payload.calendarsWithoutPermission;
      state.restricted = action.payload.restricted;
      if (state.restricted) {
        state.errorMessage =
          "You don't have required permissions to see some records.";
      } else if (action.payload.calendars.length === 0) {
        state.errorMessage = 'No records found.';
      } else {
        state.errorMessage = '';
      }
    });

    builder.addCase(fetchFilteredCalendars.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      state.processing = false;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch calendars.';
      } else {
        state.errorMessage = 'Failed to fetch calendars';
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
      state.successMessage = 'Calendar added successfully.';
    });

    builder.addCase(createCalendarEntry.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add Calendar.';
      } else {
        state.errorMessage = 'Failed to add calendar.';
      }
      state.processing = false;
    });

    builder.addCase(updateBulkCalendars.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(updateBulkCalendars.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
      state.successMessage = 'Calendar updated successfully.';
    });

    builder.addCase(updateBulkCalendars.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to update Calendar.';
      } else {
        state.errorMessage = 'Failed to update calendar.';
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

export const fetchFilteredCalendars = createAsyncThunk(
  'calendar/fetchFilteredCalendars',
  getFilteredCalendars,
);

export const createCalendarEntry = createAsyncThunk(
  'calendar/createCalendarEntry',
  createCalendar,
);

export const updateBulkCalendars = createAsyncThunk(
  'calendar/updateCalendars',
  updateCalendars,
);

export default calendarSlice.reducer;
