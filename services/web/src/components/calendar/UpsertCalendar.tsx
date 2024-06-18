import {
  ICalendar,
  ISurgeryConfiguration,
} from '@packages/entities/index.browser';
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
  const { surgeryConfigurations } = useAppSelector((state) => ({
    surgeryConfigurations: Object.values(state.surgeryConfigurations.entities),
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
            surgeryConfigurationId: data?.selectedSurgery?.id,
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
          surgeryConfigurationId: upsertCalendarData[0]?.selectedSurgery?.id,
          maxSlots: upsertCalendarData[0].maxSlots,
          bookedSlots: upsertCalendarData[0].bookedSlots,
          date: upsertCalendarData[0].date,
        };

        dispatch(createCalendarEntry(payload));
        onClose();
      }
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
                options={surgeryConfigurations.map(
                  (config: ISurgeryConfiguration) => ({
                    label: config.name,
                    id: config.id,
                    calendarId: calendar.id,
                  }),
                )}
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
                              surgeryConfigurations.find(
                                (data) => data.id === value[0].id,
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
                  placeholder="Surgery Date"
                  required
                  minDate={new Date()}
                  excludeDates={calendars.map(
                    (calendar) => new Date(calendar.date),
                  )}
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
