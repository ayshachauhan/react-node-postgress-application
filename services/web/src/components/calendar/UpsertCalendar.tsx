import {
  ICalendar,
  ISurgeryConfiguration,
} from '@packages/entities/index.browser';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch } from '@root/store';
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
import { CalendarData } from '../dashboard/UpcomingSection';

const UpsertCalendar: React.FC<{
  onClose: () => void;
  calendarData: CalendarData[];
  isUpdating: boolean;
  selectedSurgery: ISurgeryConfiguration;
  calendars: ICalendar[];
}> = ({ onClose, calendarData, isUpdating, selectedSurgery, calendars }) => {
  const maxSlotsOptions = Array.from({ length: 14 }, (_, index) => index + 1);
  const dispatch = useAppDispatch();

  const [upsertCalendarData, setUpsertCalendarData] =
    useState<CalendarData[]>(calendarData);

  const handleInputChange = (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // Update the corresponding field in the state
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
    const userId = getUserId();

    if (practiceId && userId)
      if (isUpdating) {
        const updatedData: CalendarData[] = upsertCalendarData.filter(
          (calendar, index) =>
            calendar.maxSlots !== calendarData[index].maxSlots,
        );
        const payload: UpdateCalendarsPayload = {
          practiceId,
          userId,
          data: updatedData.map((data) => ({
            id: data.id,
            bookedSlots: data.bookedSlots,
            maxSlots: data.maxSlots,
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
        const formattedDate = new Date(
          upsertCalendarData[0].date.getTime() -
            upsertCalendarData[0].date.getTimezoneOffset() * 60000,
        );

        const payload: CreateCalendarPayload = {
          practiceId,
          userId,
          surgeryConfigurationId: selectedSurgery.id,
          maxSlots: upsertCalendarData[0].maxSlots,
          bookedSlots: upsertCalendarData[0].bookedSlots,
          date: formattedDate,
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
                Type
              </label>
              <TextInput
                id={calendar.id}
                name="surgeryType"
                value={calendar.surgeryName}
                onChange={handleInputChange}
                required
                disabled={true}
              />
            </div>
            <div className="flex-1 space-y-2 px-4">
              <label htmlFor="date" className="text-black text-sm font-normal">
                Date
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
                  onChange={({ date }) =>
                    handleInputChange(date, {
                      target: { name: 'date' },
                    } as React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >)
                  }
                  placeholder="Surgery Date"
                  required
                  minDate={new Date()}
                  excludeDates={calendars.map(
                    (calendar) => new Date(calendar.date),
                  )}
                />
              )}
            </div>

            <div className="flex-1 space-y-2 px-4">
              <label
                htmlFor="bookedSlots"
                className="text-black text-sm font-normal"
              >
                Booked Slots{' '}
              </label>
              <TextInput
                id={calendar.id}
                name="bookedSlots"
                value={calendar.bookedSlots}
                onChange={handleInputChange}
                required
                disabled={true}
              />
            </div>
            <div className=" flex-1 space-y-2 px-4">
              <label
                htmlFor="maxSlots"
                className="text-black text-sm font-normal"
              >
                Max Slots{' '}
              </label>
              <Select
                options={maxSlotsOptions.map((key: number) => ({
                  label: key,
                  id: key,
                  calendarId: calendar.id,
                  disabled: isUpdating ? key < calendar.bookedSlots : false,
                }))}
                onChange={({ value }) => {
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
