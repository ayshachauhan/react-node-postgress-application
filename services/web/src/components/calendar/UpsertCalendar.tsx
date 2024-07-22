import { ICalendar, ISurgeryType } from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  createCalendarEntry,
  updateBulkCalendars,
} from '@root/store/reducers/calendar';
import {
  CreateCalendarPayload,
  UpdateCalendarsPayload,
} from '@root/store/requests/calendar';
import { getPracticeId, getUserId } from '@root/utils';
import { DEFAULT_SURGERYLOCATION_COLOR } from '@root/utils/constants';
import { DatePicker } from 'baseui/datepicker';
import { Select } from 'baseui/select';
import moment from 'moment';
import React, { useState } from 'react';
import RequiredIndicator from '../RequiredIndicator';
import { CalendarData } from '../dashboard/UpcomingSection';

const UpsertCalendar: React.FC<{
  onClose: () => void;
  calendarData: CalendarData[];
  isUpdating: boolean;
  calendars: ICalendar[];
}> = ({ onClose, calendarData, isUpdating, calendars }) => {
  const maxSlotsOptions = Array.from({ length: 14 }, (_, index) => index + 1);
  const dispatch = useAppDispatch();
  const { surgeryTypes } = useAppSelector((state) => ({
    surgeryTypes: Object.values(state.surgeryTypes.entities),
  }));

  const [upsertCalendarData, setUpsertCalendarData] =
    useState<CalendarData[]>(calendarData);

  const handleInputChange = (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUpsertCalendarData((prevData) =>
      prevData.map((calendar: CalendarData) => ({
        ...calendar,
        ...(event?.target ? { [event?.target.name]: value } : {}),
      })),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const practiceId = getPracticeId();
    const userId: string | null = getUserId();

    if (practiceId && userId)
      if (isUpdating) {
        const updatedData: CalendarData[] = upsertCalendarData.filter(
          (calendar, index) =>
            calendar.maxSlots !== calendarData[index].maxSlots ||
            calendar.selectedSurgery !== calendarData[index].selectedSurgery,
        );
        const payload: UpdateCalendarsPayload = {
          practiceId,
          userId,
          data: updatedData.map((data: CalendarData) => ({
            id: data.id,
            bookedSlots: data.bookedSlots,
            maxSlots: data.maxSlots,
            surgeryTypeId: data?.selectedSurgery?.id,
          })),
        };
        if (updatedData.length) {
          try {
            dispatch(updateBulkCalendars(payload));
            onClose();
          } catch (error) {
            onClose();
          }
        }
      } else {
        const payload: Omit<
          CreateCalendarPayload,
          'month' | 'option' | 'loggedInUserId'
        > = {
          practiceId,
          userId,
          surgeryTypeId: upsertCalendarData[0]?.selectedSurgery?.id,
          maxSlots: upsertCalendarData[0].maxSlots,
          bookedSlots: upsertCalendarData[0].bookedSlots,
          date: upsertCalendarData[0].date,
        };

        dispatch(createCalendarEntry(payload));
        onClose();
      }
  };

  const isCalendarDates = (date: Date): boolean => {
    const formattedDate = moment(date).format('YYYY-MM-DD'); // Get date part only

    const dates = (calendars as ICalendar[])
      .filter((calendar: ICalendar) =>
        moment(calendar?.date).format('YYYY-MM-DD'),
      )
      .map((calendar) => moment(calendar?.date).format('YYYY-MM-DD'));

    return Boolean(dates.find((date) => date === formattedDate));
  };

  const isSlotsAvailable = (date: Date): Record<string, unknown> => {
    const formattedDate = moment(date).format('YYYY-MM-DD'); // Get date part only

    const matchingCalendars = (calendars as ICalendar[]).filter(
      (calendar: ICalendar) =>
        moment(calendar.date).format('YYYY-MM-DD') === formattedDate,
    ) as ICalendar[];

    const sortedCalendars = matchingCalendars.sort((a, b) => {
      if (a.maxSlots !== b.maxSlots) {
        return b.maxSlots - a.maxSlots; // Descending order by maxSlots
      } else if (a.bookedSlots !== b.bookedSlots) {
        return b.bookedSlots - a.bookedSlots; // Descending order by bookedSlots
      } else {
        return a.surgeryType.name.localeCompare(b.surgeryType.name); // Alphabetical order by surgeryType.name
      }
    });

    const calendar = sortedCalendars[0];

    const surgeryTypeColor =
      calendar.surgeryType?.color ?? DEFAULT_SURGERYLOCATION_COLOR;

    return calendar.maxSlots > calendar.bookedSlots
      ? {
          backgroundColor: surgeryTypeColor,
          borderTopColor: surgeryTypeColor,
          borderBottomColor: surgeryTypeColor,
          borderRightColor: surgeryTypeColor,
          borderLeftColor: surgeryTypeColor,
        }
      : {
          backgroundColor: 'transparent',
          border: `${surgeryTypeColor} solid 3px`,
          borderTopColor: surgeryTypeColor,
          borderBottomColor: surgeryTypeColor,
          borderRightColor: surgeryTypeColor,
          borderLeftColor: surgeryTypeColor,
        };
  };
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const handleMonthChange = ({ date }) => {
    setCurrentMonth(date.getMonth() + 1);
  };

  const getBackGroundColorCss = (date: Date): Record<string, unknown> => {
    // checking selected month here because sometimes bg colors are reflecting in next month

    // console.log(date, date.getMonth() + 1, 'datebg', currentMonth);

    return date.getMonth() + 1 == currentMonth
      ? isCalendarDates(date)
        ? isSlotsAvailable(date)
        : { backgroundColor: 'transparent' }
      : {};
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {upsertCalendarData.map((calendar: CalendarData, index: number) => (
          <div className="flex flex-row justify-between pt-4" key={index}>
            <div className=" flex-1 space-y-2 px-4">
              <label
                htmlFor="userName"
                className="text-black text-sm font-normal"
              >
                <RequiredIndicator />
                &nbsp;Type
              </label>

              <Select
                options={surgeryTypes.map((config: ISurgeryType) => ({
                  label: config.name,
                  id: config.id,
                  calendarId: calendar.id,
                }))}
                onChange={({ value }) => {
                  if (!value.length) {
                    return;
                  }

                  setUpsertCalendarData((prevData) =>
                    prevData.map((cal: CalendarData) =>
                      cal.id === value[0]?.calendarId
                        ? {
                            ...cal,
                            selectedSurgery:
                              surgeryTypes.find(
                                (data: ISurgeryType) => data.id === value[0].id,
                              ) ?? calendar.selectedSurgery,
                          }
                        : cal,
                    ),
                  );
                }}
                value={[
                  {
                    label: calendar.selectedSurgery.name,
                    id: calendar.selectedSurgery.id,
                  },
                ]}
                required
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      color: 'rgba(82, 82, 91, 1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow CSS here
                    },
                  },
                  ClearIcon: {
                    component: () => null,
                  },
                }}
              />
            </div>
            <div className="flex-1 space-y-2 px-4">
              <label htmlFor="date" className="text-black text-sm font-normal">
                <RequiredIndicator />
                &nbsp;Date
              </label>
              {isUpdating ? (
                <TextInput
                  id={calendar.id}
                  name="date"
                  value={moment(calendar.date).format('YYYY-MM-DD')}
                  onChange={handleInputChange}
                  required
                  disabled={isUpdating}
                />
              ) : (
                <DatePicker
                  value={calendar.date}
                  onChange={({ date }) => {
                    handleInputChange(date, {
                      target: { name: 'date' },
                    } as React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >);
                  }}
                  onMonthChange={handleMonthChange}
                  placeholder="Surgery Date"
                  required
                  excludeDates={calendars.map(
                    (calendar) => new Date(calendar.date),
                  )}
                  overrides={{
                    Day: {
                      style: ({ $date, $selected }) => {
                        return {
                          height: '53px',
                          width: '53px',
                          borderRadius: '50%',
                          boxSizing: 'border-box',
                          paddingTop: '6px',
                          paddingBottom: '6px',
                          margin: '2px',
                          ...getBackGroundColorCss($date),
                          ':after': '',
                          ...($selected
                            ? {
                                color: '#ffffff',
                                ...($date.getMonth() + 1 == currentMonth
                                  ? isCalendarDates($date)
                                    ? isSlotsAvailable($date)
                                    : { backgroundColor: '#000000' }
                                  : {}),
                              }
                            : {}),
                        };
                      },
                    },
                  }}
                />
              )}
            </div>
            <div className=" flex-1 space-y-2 px-4">
              <label
                htmlFor="maxSlots"
                className="text-black text-sm font-normal"
              >
                <RequiredIndicator />
                &nbsp;Max Slots{' '}
              </label>
              <Select
                options={maxSlotsOptions.map((key: number) => ({
                  label: key,
                  id: key,
                  calendarId: calendar.id,
                  disabled: isUpdating ? key < calendar.bookedSlots : false,
                }))}
                onChange={({ value }) => {
                  if (!value.length) {
                    return;
                  }
                  setUpsertCalendarData((prevData) =>
                    prevData.map((cal: CalendarData) =>
                      cal.id === value[0].calendarId
                        ? {
                            ...cal,
                            maxSlots: value[0].label as number,
                          }
                        : cal,
                    ),
                  );
                }}
                value={[{ label: calendar.maxSlots, id: calendar.id }]}
                required
                overrides={{
                  ControlContainer: {
                    style: {
                      backgroundColor: 'rgba(250, 250, 250, 1)',
                      border: 'none',
                      color: 'rgba(82, 82, 91, 1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add shadow CSS here
                    },
                  },
                  ClearIcon: {
                    component: () => null,
                  },
                }}
              />
            </div>
          </div>
        ))}
        <div
          className="space-y-2 px-4 py-4 mt-8 flex justify-end"
          style={{ position: 'sticky', bottom: 0, backgroundColor: 'white' }}
        >
          <Button
            kind="primary"
            title={isUpdating ? 'Update' : 'Add'}
            width={100}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default UpsertCalendar;
