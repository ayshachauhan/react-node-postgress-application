'use client';
import { AddIcon, EditIcon } from '@components/Icons';
import { ICalendar, ISurgeryType } from '@packages/entities/index.browser';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchCalendars } from '@root/store/reducers/calendar';
import { fetchListings } from '@root/store/reducers/surgeryTypes';
import { getPracticeId, getUserId } from '@root/utils/index';
import { Modal, ModalBody, ModalHeader, ROLE } from 'baseui/modal';
import React, { useEffect, useState } from 'react';
import UpsertCalendar from '../calendar/UpsertCalendar';

export type CalendarData = {
  id: string;
  date: string;
  maxSlots: number;
  availableSlots: number;
  surgeryType: string;
};

const UpcomingSection: React.FC = () => {
  const dispatch = useAppDispatch();

  const calendars = useAppSelector((state) =>
    Object.values(state.calendars.entities),
  );

  const surgeryTypes = useAppSelector((state) =>
    Object.values(state.surgeryTypes.entities),
  );

  const practiceId = getPracticeId();
  const userId = getUserId();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [selectedSurgery, setSelectedSurgery] = useState<ISurgeryType | null>(
    null,
  );

  const appendAddSign = (cellValue: number) => {
    return '+' + cellValue;
  };

  const maxCellStyle = (cellValue: string) => {
    const numericValue =
      typeof cellValue === 'string'
        ? parseInt(cellValue.replace('%', ''), 10)
        : cellValue;
    const isMax = numericValue === 14;
    const isRed = numericValue === 0;
    const isGreen = numericValue > 0;

    if (isMax) {
      return {
        backgroundColor: 'rgba(34, 197, 94, 1)',
        color: 'white',
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingTop: '0px',
        paddingBottom: '0px',
        borderRadius: '5px',
        justifyContent: 'center',
      };
    } else if (isRed) {
      return {
        backgroundColor: 'rgba(239, 68, 68, 1)',
        color: 'white',
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingTop: '0px',
        paddingBottom: '0px',
        borderRadius: '5px',
        justifyContent: 'center',
      };
    } else if (isGreen) {
      return { color: 'rgba(22, 163, 74, 1)' };
    } else {
      return {};
    }
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId }));
    }

    if (practiceId !== null && userId !== null) {
      dispatch(fetchCalendars({ practiceId, userId }));
    }
  }, [practiceId, userId, dispatch]);

  useEffect(() => {
    if (surgeryTypes.length > 0 && selectedSurgery === null) {
      setSelectedSurgery(surgeryTypes[0]);
    }
  }, [surgeryTypes]);

  const toggleActive = (surgeryType: ISurgeryType) => {
    setSelectedSurgery(surgeryType);
  };

  const filterCalendarByMonth = (calendars: CalendarData[]): CalendarData[] => {
    const currentDate = new Date();
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
    .filter((data: ICalendar) => data.surgeryType.id === selectedSurgery?.id)
    .map((data: ICalendar) => ({
      id: data.id,
      date: new Date(data.date).toISOString().split('T')[0],
      maxSlots: data.maxSlots,
      availableSlots: data.availableSlots,
      surgeryType: data.surgeryType.name.charAt(0).toUpperCase(),
    }));

  const filteredCalendars = filterCalendarByMonth(upcomingDates);
  const splitData = splitCalendarData(filteredCalendars);

  const handleOpenModal = (isUpdating: boolean): void => {
    console.log(isModalOpen, 'modalopen');
    setIsModalOpen(true);
    setIsUpdating(isUpdating);
  };
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

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
            calendarData={
              isUpdating
                ? filteredCalendars
                : [
                    {
                      id: '',
                      maxSlots: 14,
                      availableSlots: 14,
                      date: '',
                      surgeryType: selectedSurgery?.name
                        .charAt(0)
                        .toUpperCase() as string,
                    },
                  ]
            }
            isUpdating={isUpdating ?? false}
            selectedSurgery={selectedSurgery as ISurgeryType}
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
            <div
              className="cursor-pointer px-2"
              onClick={() => handleOpenModal(true)}
            >
              <EditIcon className="mt-2"></EditIcon>
            </div>
          </div>
        )}
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      <div className="flex w-full bg-green-50 pr-2 border-b border-green-200 items-center">
        <div className="flex items-center">
          {surgeryTypes.map((item: ISurgeryType, index) => (
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
      <div className="mt-2 flex justify-between overflow-x-auto text-xs">
        <div className="border-r-4 border-gray-200 pr-4">
          <div className="mt-2 text-xs">
            <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
              {splitData.map((calendar) => (
                <>
                  <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
                    <div className="font-bold text-white p-4 w-10">T</div>
                    <div className="font-bold text-white p-4 w-40">Date</div>
                    <div className="font-bold text-white p-4 w-10">Now</div>
                    <div className="font-bold text-white p-4 w-10">Max</div>
                    <div className="font-bold text-white p-4 w-10"></div>
                  </div>
                  {calendar.map((data: CalendarData) => (
                    <React.Fragment key={data.id}>
                      <div className={`flex items-center`}>
                        <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                          {data.surgeryType}
                        </div>
                        <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-40">
                          {data.date}
                        </div>
                        <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                          {data.availableSlots}
                        </div>
                        <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                          {data.maxSlots}
                        </div>
                        <div
                          className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10 text-center"
                          style={maxCellStyle(appendAddSign(data.maxSlots))}
                        >
                          {appendAddSign(data.maxSlots)}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      <UpsertCalendarModal isUpdating={isUpdating} />
    </div>
  );
};

export default UpcomingSection;
