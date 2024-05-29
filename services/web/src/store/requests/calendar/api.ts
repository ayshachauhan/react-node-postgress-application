import { CalendarEntity } from '@packages/entities';
import { ICalendar } from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';
import { constructQueryParams } from '@root/utils';
import {
  CalendarsPayload,
  CreateCalendarPayload,
  GetCalendarByIdPayload,
  GetCalendarsPayload,
  UpdateCalendarPayload,
  UpdateCalendarsPayload,
} from './types';

interface CalendarSearchResult {
  calendars: CalendarEntity[];
  restricted: boolean;
}

const apiClient = new ApiService();

export const getUrlPath = (payload: CalendarsPayload) => {
  return `/practices/${payload.practiceId}/users/${payload.userId}/calendar`;
};

export const getSearchUrlPath = (
  payload: CalendarsPayload,
  queryParams: string,
): string => {
  return `/practices/${payload.practiceId}/users/${payload.userId}/calendar/search${queryParams}`;
};

/**
 * @summary Get calendar by Practice, user and surgerytype id
 * @param payloadData
 * @param param1
 * @returns calendar entity array as a response
 */
export const getCalendars = async (
  payload: GetCalendarsPayload,
  { rejectWithValue },
): Promise<ICalendar[]> => {
  try {
    const response: Response = await apiClient.get(getUrlPath(payload));

    if (!response.ok) {
      throw new Error('Failed to fetch calendars');
    }

    const data: ICalendar[] = await response.json();

    console.log(data, 'datacalendar');

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @summary Add calendar for a practice
 * @param payloadData
 * @param param1
 * @returns Icalendar
 */
export const createCalendar = async (
  payload: Omit<CreateCalendarPayload, 'month' | 'option' | 'loggedInUserId'>,
  { rejectWithValue },
): Promise<ICalendar> => {
  try {
    console.log(payload, 'payloadcreate');

    const response: Response = await apiClient.post(
      getUrlPath(payload),
      payload,
    );

    console.log(response, 'respcre');

    if (!response.ok) {
      throw new Error('Failed to add calendar entry');
    }
    const data: ICalendar = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @summary Get calendar by id
 * @param payloadData
 * @param param1
 * @returns calendar entity as a response
 */
export const getCalendarById = async (
  payload: GetCalendarByIdPayload,
  { rejectWithValue },
): Promise<ICalendar> => {
  try {
    const response: Response = await apiClient.get(
      `${getUrlPath(payload)}/${payload.id}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch calendar by calendar id');
    }

    const data: ICalendar = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @summary Update calendar for a practice
 * @param payloadData
 * @param param1
 * @returns Icalendar
 */
export const updateCalendar = async (
  payload: UpdateCalendarPayload,
  { rejectWithValue },
): Promise<ICalendar> => {
  try {
    const response: Response = await apiClient.patch(
      `${getUrlPath(payload)}/${payload.id}`,
      payload,
    );
    if (!response.ok) {
      throw new Error('Failed to add calendar entry');
    }
    const data: ICalendar = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @summary Update calendar for a practice
 * @param payloadData
 * @param param1
 * @returns Icalendar
 */
export const updateCalendars = async (
  payload: UpdateCalendarsPayload,
  { rejectWithValue },
): Promise<ICalendar[]> => {
  try {
    const response: Response = await apiClient.patch(
      `${getUrlPath(payload)}`,
      payload,
    );
    if (!response.ok) {
      throw new Error('Failed to add calendar entry');
    }
    const data: ICalendar[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @summary Get filtered calendar by Practice, user, surgerytype id, month, loggedInUserId and option
 * @param payloadData
 * @param param1
 * @query month, option, loggedInUserId
 * @returns calendar entity array as a response
 */
export const getFilteredCalendars = async (
  payload: GetCalendarsPayload,
  { rejectWithValue },
): Promise<CalendarSearchResult> => {
  try {
    const queryParams = constructQueryParams({
      month: payload.month,
      option: payload.option,
      loggedInUserId: payload.loggedInUserId,
    });

    // Check if there are any query parameters
    if (queryParams) {
      const response: Response = await apiClient.get(
        getSearchUrlPath(payload, queryParams),
      );

      if (!response.ok) {
        throw new Error('Failed to fetch calendars');
      }

      const data: CalendarSearchResult = await response.json();

      return data;
    } else {
      throw new Error('No query parameters provided');
    }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
