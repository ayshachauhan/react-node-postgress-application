'use client';
import { AddIcon, EditIcon } from '@components/Icons';
import {
  ICalendar,
  ISurgeryConfiguration,
} from '@packages/entities/index.browser';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchCalendars } from '@root/store/reducers/calendar';
import { fetchListings } from '@root/store/reducers/surgeryConfigurations';
import { DEFAULT_SURGERYNAME_COLOR } from '@root/utils/constants';
import { getPracticeId, getUserId } from '@root/utils/index';
import { Modal, ModalBody, ModalHeader, ROLE } from 'baseui/modal';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import UpsertCalendar from '../calendar/UpsertCalendar';

export type CalendarData = {
  id: string;
  date: Date;
  maxSlots: number;
  bookedSlots: number;
  surgeryName: string;
  surgeryNameColor: string;
};

export const DEFAULT_MAX_SLOTS: number = 14;

const UpcomingSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const userId: string | null = getUserId();
  const userInfo = useAppSelector((state) => state.auth.user);
  const userPermissions = userInfo?.permissions;

  const editCaseAllowed = useUserPermission(userPermissions, ['edit_case']);

  const { calendars, surgeryConfigurations } = useAppSelector((state) => ({
    calendars: Object.values(state.calendars.entities).filter(
      (calendar) => calendar.user.id === userId,
    ),
    surgeryConfigurations: Object.values(state.surgeryConfigurations.entities),
  }));

  const practiceId: string | null = getPracticeId();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [selectedSurgery, setSelectedSurgery] =
    useState<ISurgeryConfiguration | null>(null);

  /**
   * @summary append + sign
   * @param cellValue number
   */
  const appendAddSign = (cellValue: number): string => {
    return cellValue > 0 ? '+' + cellValue : cellValue.toString();
  };

  /**
   * @summary css for available slots view
   * @param availableSlots
   * @returns css for available slots view
   */
  const maxCellStyle = (availableSlots: number): Record<string, string> => {
    const isMax = availableSlots === DEFAULT_MAX_SLOTS;
    const isRed = availableSlots <= 0;
    const isGreen = availableSlots > 0;

    const cssObject = {
      color: 'white',
      paddingLeft: '4px',
      paddingRight: '4px',
      paddingTop: '0px',
      paddingBottom: '0px',
      borderRadius: '5px',
      justifyContent: 'center',
    };

    if (isMax) {
      return {
        ...cssObject,
        backgroundColor: 'rgba(34, 197, 94, 1)',
      };
    } else if (isRed) {
      return {
        ...cssObject,
        backgroundColor: 'rgba(239, 68, 68, 1)',
      };
    } else if (isGreen) {
      return { color: 'rgba(22, 163, 74, 1)' };
    } else {
      return {};
    }
  };

  const currentDate = new Date();

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId }));
    }

    if (practiceId !== null && userId !== null) {
      dispatch(fetchCalendars({ practiceId, userId }));
    }
  }, [practiceId, userId, dispatch]);

  useEffect(() => {
    if (surgeryConfigurations.length > 0 && selectedSurgery === null) {
      setSelectedSurgery(surgeryConfigurations[0]);
    }
  }, [surgeryConfigurations]);

  const toggleActive = (surgeryType: ISurgeryConfiguration) => {
    setSelectedSurgery(surgeryType);
  };

  const filterCalendarByMonth = (calendars: CalendarData[]): CalendarData[] => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const startDate = new Date(currentYear, currentMonth, 1);

    return calendars
      .filter((calendar) => {
        const calendarDate = new Date(calendar.date);

        // Adjust the filter condition to include all calendars from the current date onwards
        return calendarDate >= startDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  };

  /**
   * @summary split calendar data so it can render only 7 dates in one view
   * @param calendars
   * @returns
   */
  const splitCalendarData = (calendars: CalendarData[]): CalendarData[][] => {
    const splitData: CalendarData[][] = [];
    let currentPart: CalendarData[] = [];

    calendars.forEach((calendar, index) => {
      currentPart.push(calendar);
      if (currentPart.length === 7 || index === calendars.length - 1) {
        splitData.push(currentPart);
        currentPart = [];
      }
    });

    return splitData;
  };

  const upcomingDates: CalendarData[] = calendars
    .filter(
      (data: ICalendar) => data.surgeryConfiguration.id === selectedSurgery?.id,
    )
    .map((data: ICalendar) => ({
      id: data.id,
      date: data.date,
      maxSlots: data.maxSlots,
      bookedSlots: data.bookedSlots,
      surgeryName: data.surgeryConfiguration.name.charAt(0).toUpperCase(),
      surgeryNameColor:
        data.surgeryConfiguration.color ?? DEFAULT_SURGERYNAME_COLOR,
    }));

  const filteredCalendars = filterCalendarByMonth(upcomingDates);

  const handleOpenModal = (isUpdating: boolean): void => {
    setIsModalOpen(true);
    setIsUpdating(isUpdating);
  };
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  /**
   * @summary Upsert calendar modal to add or update the data
   * @param param0
   * @returns
   */
  const UpsertCalendarModal = ({ isUpdating }: { isUpdating: boolean }) => {
    return (
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        closeable
        animate
        autoFocus
        size={'60vw'}
        role={ROLE.dialog}
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              outline: `${$theme.colors.warning200} solid`,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }),
          },
          Dialog: {
            style: () => ({
              maxHeight: '80vh', // Set a maximum height for the modal
              overflowY: 'auto', // Enable vertical scrolling
            }),
          },
        }}
      >
        <ModalHeader
          $style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            borderBottom: '1px solid rgba(244, 244, 245, 1)',
            paddingBottom: '8px',
          }}
        >
          {isUpdating ? 'Update Calendar' : 'Add New Calendar'}
        </ModalHeader>
        <ModalBody>
          <UpsertCalendar
            onClose={handleCloseModal}
            //@ts-expect-error sending date as null
            calendarData={
              isUpdating
                ? filteredCalendars
                : [
                    {
                      id: '',
                      maxSlots: DEFAULT_MAX_SLOTS,
                      bookedSlots: 0,
                      date: null,
                      surgeryName: selectedSurgery?.name
                        .charAt(0)
                        .toUpperCase() as string,
                      surgeryNameColor:
                        selectedSurgery?.color ?? DEFAULT_SURGERYNAME_COLOR,
                    },
                  ]
            }
            isUpdating={isUpdating ?? false}
            selectedSurgery={selectedSurgery as ISurgeryConfiguration}
            calendars={calendars}
          />
        </ModalBody>
      </Modal>
    );
  };

  return (
    <div>
      <div className="text-lg font-normal flex justify-between">
        <span>Calendar</span>
        {selectedSurgery && (
          <div className="flex">
            <div
              className="cursor-pointer px-2"
              onClick={() => handleOpenModal(false)}
            >
              <AddIcon className="mt-2" size={25}></AddIcon>
              {''}
            </div>
            {editCaseAllowed && (
              <div
                className="cursor-pointer px-2"
                onClick={() => handleOpenModal(true)}
              >
                <EditIcon className="mt-2"></EditIcon>
              </div>
            )}
          </div>
        )}
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="flex w-full bg-green-50 pr-2 border-b border-green-200 items-center">
        <div className="flex items-center">
          {surgeryConfigurations.map((item: ISurgeryConfiguration, index) => (
            <div className="mr-1" key={index}>
              <button
                className="py-2 px-4 text-xs text-black text-normal border-b-2 border-transparent hover:text-white hover:bg-gradient-to-r from-primary-light to-primary-dark hover:rounded-t-lg"
                style={{
                  ...(selectedSurgery?.id === item.id && {
                    backgroundImage:
                      'linear-gradient(to right, rgba(53, 165, 118, 1), rgba(17, 113, 128, 1))',
                    color: 'white',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                  }),
                }}
                onClick={() => toggleActive(item)}
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-5 overflow-x-auto text-xs">
        {splitCalendarData(filteredCalendars).map(
          (calendar: CalendarData[], index: number) => (
            <div className="border-r-4 border-gray-200 pr-4 flex" key={index}>
              <div className="mt-2 text-xs">
                <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
                  <>
                    <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
                      <div className="font-bold text-white p-4 w-10">T</div>
                      <div className="font-bold text-white p-4 w-40">Date</div>
                      <div className="font-bold text-white p-4 w-10">Now</div>
                      <div className="font-bold text-white p-4 w-10">Max</div>
                      <div className="font-bold text-white p-4 w-10"></div>
                    </div>
                    {calendar.map((data: CalendarData, index) => {
                      const availableSlots: number =
                        data.maxSlots - data.bookedSlots;
                      return (
                        <React.Fragment key={data.id}>
                          <div
                            className={`flex items-center ${
                              index !== calendar.length - 1
                                ? 'border-b border-gray-300'
                                : ''
                            }`}
                          >
                            <div
                              className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10"
                              style={{ background: data.surgeryNameColor }}
                            >
                              {data.surgeryName}
                            </div>
                            <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-40">
                              {moment(data.date).format('YYYY-MM-DD')}
                            </div>
                            <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                              {data.bookedSlots}
                            </div>
                            <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                              {data.maxSlots}
                            </div>
                            <div
                              className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10 text-center"
                              style={maxCellStyle(availableSlots)}
                            >
                              {appendAddSign(availableSlots)}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
      <UpsertCalendarModal isUpdating={isUpdating} />
    </div>
  );
};

export default UpcomingSection;
