'use client';
import { AddIcon, EditIcon } from '@components/Icons';
import {
  ICalendar,
  ISurgeryType,
  MonthOption,
  USER_PERMISSIONS,
  UserType,
} from '@packages/entities/index.browser';
import { useUserPermission } from '@root/hooks/userHasPermission';
import { State, useAppDispatch, useAppSelector } from '@root/store';
import { fetchFilteredCalendars } from '@root/store/reducers/calendar';
import { fetchListings } from '@root/store/reducers/surgeryConfigurations';
import { SanitizedUser } from '@root/store/types';
import { DEFAULT_SURGERYNAME_COLOR } from '@root/utils/constants';
import { MESSAGE_TYPE } from '@root/utils/enums';
import {
  customBackgroundColor,
  getPracticeId,
  getSelectedMonths,
  getUserId,
} from '@root/utils/index';
import { Modal, ModalBody, ModalHeader, ROLE } from 'baseui/modal';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ModalCloseEvent } from '../BaseUiModal/BaseUiModal';
import UpsertCalendar from '../calendar/UpsertCalendar';

export type CalendarData = {
  id: string;
  date: Date;
  maxSlots: number;
  bookedSlots: number;
  surgeryName: string;
  surgeryNameColor: string;
  selectedSurgery: ISurgeryType;
};

export interface CalendarMessage {
  messageType: MESSAGE_TYPE;
  message: string;
}

export const DEFAULT_MAX_SLOTS: number = 14;

export type SetMessageFunction = (messageObj: CalendarMessage) => void;

const UpcomingSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const userId: string | null = getUserId();
  const { entities } = useAppSelector((state: State) => state.users);
  const allDoctorUsers = Object.values(entities).filter(
    (user) => user.type == UserType.DOCTOR,
  );
  const userInfo = useAppSelector((state) => state.auth?.user);
  const userPermissions = userInfo?.permissions;
  const loggedInUserId = userInfo?.id;
  const { calendars, surgeryTypes } = useAppSelector((state) => ({
    calendars: Object.values(state.calendars?.entities).filter(
      (calendar) => calendar?.user?.id === userId,
    ),
    surgeryTypes: Object.values(state.surgeryTypes?.entities),
  }));

  const { errorMessage, calendarsWithoutPermission, restricted } =
    useAppSelector((state) => state.calendars);

  const practiceId: string | null = getPracticeId();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const modalRef = useRef(null);
  const [calendarMessage, setCalendarMessage] = useState<CalendarMessage>({
    messageType: MESSAGE_TYPE.INFO,
    message: '',
  });

  const [selectedSurgery, setSelectedSurgery] = useState<ISurgeryType | null>(
    null,
  );

  /**
   * @summary append + sign
   * @param cellValue number
   */
  const appendAddSign = (availableSlots: number): string => {
    return availableSlots > 0
      ? '+' + availableSlots
      : availableSlots === 0
        ? 'F'
        : availableSlots.toString();
  };

  /**
   * @summary css for available slots view
   * @param availableSlots
   * @returns css for available slots view
   */
  const maxCellStyle = (availableSlots: number): Record<string, string> => {
    const isFull = availableSlots === 0;
    const isRed = availableSlots < 0;
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

    if (isFull) {
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

  const { selectedMonth, selectedValue } = useAppSelector(
    (state) => state.surgeries?.surgeryFilters,
  );
  const selectedValueStr = selectedValue || '';

  const dispatchFetchFilteredCalendars = (
    practiceId: string,
    userId: string,
    selectedMonth: MonthOption[],
    option: string,
    loggedInUserId: string,
  ) => {
    const month = getSelectedMonths(selectedMonth);
    dispatch(
      fetchFilteredCalendars({
        practiceId,
        userId,
        month,
        option,
        loggedInUserId,
      }),
    );
  };

  useEffect(() => {
    if (practiceId !== null) {
      dispatch(fetchListings({ practiceId }));
    }

    if (practiceId !== null && userId !== null && loggedInUserId) {
      dispatchFetchFilteredCalendars(
        practiceId,
        userId,
        selectedMonth,
        selectedValueStr,
        loggedInUserId,
      );
    }
  }, [
    practiceId,
    userId,
    selectedMonth,
    selectedValue,
    loggedInUserId,
    dispatch,
  ]);

  useEffect(() => {
    if (surgeryTypes.length > 0 && selectedSurgery === null) {
      setSelectedSurgery(surgeryTypes[0]);
    } else if (selectedSurgery?.id) {
      const findElement = surgeryTypes.find(
        (s) => s.id === selectedSurgery?.id,
      );
      if (!findElement) {
        setSelectedSurgery(surgeryTypes[0]);
      }
    }
  }, [surgeryTypes]);

  useEffect(() => {
    let timer;
    if (calendarMessage.message) {
      timer = setTimeout(() => {
        setCalendarMessage({
          messageType: MESSAGE_TYPE.INFO,
          message: '',
        });
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [calendarMessage.message]);

  const toggleActive = (surgeryType: ISurgeryType) => {
    setSelectedSurgery(surgeryType);
  };

  const filterCalendarByMonth = (calendars: CalendarData[]): CalendarData[] => {
    return calendars.sort((a, b) => {
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

  const selectedSurgeryCalData: ICalendar[] = calendars.filter(
    (data: ICalendar) => data?.surgeryType?.id === selectedSurgery?.id,
  );

  const upcomingDates: CalendarData[] = selectedSurgeryCalData.map(
    (data: ICalendar) => ({
      id: data.id,
      date: data.date,
      maxSlots: data.maxSlots,
      bookedSlots: data.bookedSlots,
      // using data from selectedsurgery here because calendar data doesn't contain surgerytype relation, for fallback using surgeryconfig name
      surgeryName:
        selectedSurgery?.name.charAt(0).toUpperCase() ??
        data?.surgeryType?.name.charAt(0).toUpperCase(),
      surgeryNameColor: data?.surgeryType?.color ?? DEFAULT_SURGERYNAME_COLOR,
      selectedSurgery: selectedSurgery as ISurgeryType,
    }),
  );

  const filteredCalendars = filterCalendarByMonth(upcomingDates);

  const handleOpenModal = (isUpdating: boolean): void => {
    setIsModalOpen(true);
    setIsUpdating(isUpdating);
  };
  const handleCloseModal = (event?: ModalCloseEvent): void => {
    if (event?.closeSource === 'backdrop') {
      return;
    }
    setIsModalOpen(false);
  };

  const editCalendar = useUserPermission(userPermissions, [
    USER_PERMISSIONS.EDIT_CALENDAR,
  ]);

  const calendarData = splitCalendarData(filteredCalendars);

  const recordExists = calendarsWithoutPermission.some(
    (calendar: ICalendar) => {
      return calendar?.surgeryType?.name === selectedSurgery?.name;
    },
  );

  let displayErrorMessage: string;

  if (calendarData.length === 0 && recordExists && restricted) {
    displayErrorMessage =
      errorMessage || 'You dont have required permissions to see some records.';
  } else {
    displayErrorMessage = 'No records found';
  }

  const memoizedSetMessage = useCallback((msgObj: CalendarMessage) => {
    setCalendarMessage(msgObj);
  }, []);

  const nextValidDate: Date = new Date();

  /**
   * @summary Upsert calendar modal to add or update the data
   * @param param0
   * @returns
   */
  const UpsertCalendarModal = ({
    isUpdating,
    calendarMessageFunc,
    allDoctors,
  }: {
    isUpdating: boolean;
    calendarMessageFunc: SetMessageFunction;
    allDoctors: SanitizedUser[];
  }) => {
    return (
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        closeable
        animate
        autoFocus
        size={'60vw'}
        role={ROLE.dialog}
        ref={modalRef}
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
                      maxSlots: DEFAULT_MAX_SLOTS,
                      bookedSlots: 0,
                      date: nextValidDate,
                      surgeryName: selectedSurgery?.name ?? 'N/A',
                      surgeryNameColor:
                        selectedSurgery?.color ?? DEFAULT_SURGERYNAME_COLOR,
                      selectedSurgery: selectedSurgery as ISurgeryType,
                    },
                  ]
            }
            isUpdating={isUpdating ?? false}
            calendars={calendars}
            calendarMessageFunc={calendarMessageFunc}
            allDoctors={allDoctors}
          />
        </ModalBody>
      </Modal>
    );
  };

  return (
    <div>
      <div className="text-lg font-normal flex justify-between">
        <span>Calendar</span>
        <span
          style={{
            color:
              calendarMessage.messageType === MESSAGE_TYPE.ERROR
                ? 'red'
                : 'green',
            fontSize: '12px',
          }}
        >
          {calendarMessage.message}
        </span>
        {selectedSurgery && allDoctorUsers.length > 0 && (
          <div className="flex gap-3 items-center">
            <div
              className="cursor-pointer flex items-center"
              onClick={() => handleOpenModal(false)}
            >
              <AddIcon></AddIcon>
              {''}
            </div>
            {editCalendar && (
              <div
                className="cursor-pointer flex items-center"
                onClick={() => handleOpenModal(true)}
              >
                <EditIcon></EditIcon>
              </div>
            )}
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
      <div className="flex items-start mt-2 overflow-x-auto text-xs">
        {calendarData.length > 0 ? (
          calendarData.map((calendar: CalendarData[], index: number) => (
            <div
              className="inline-flex border-r-4 border-gray-200 pr-3 mr-3"
              key={index}
            >
              <table>
                <thead>
                  <tr className="">
                    <th className="">T</th>
                    <th className="">Date</th>
                    <th className="">Now</th>
                    <th className="">Max</th>
                    <th className=""></th>
                  </tr>
                </thead>
                <tbody>
                  {calendar.map((data: CalendarData, index) => {
                    const availableSlots: number =
                      data.maxSlots - data.bookedSlots;
                    return (
                      <React.Fragment key={data.id}>
                        <tr
                          className={`${
                            index !== calendar.length - 1
                              ? 'border-b border-gray-300'
                              : ''
                          }`}
                        >
                          <td
                            className="text-white"
                            style={{
                              background: customBackgroundColor(
                                data.date,
                                selectedSurgeryCalData,
                              ),
                            }}
                          >
                            {data.surgeryName}
                          </td>
                          <td className="whitespace-nowrap">
                            {moment(data.date).format('YYYY-MM-DD')}
                          </td>
                          <td className="">{data.bookedSlots}</td>
                          <td className="">{data.maxSlots}</td>
                          <td
                            className="text-center"
                            style={maxCellStyle(availableSlots)}
                          >
                            {appendAddSign(availableSlots)}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div>{displayErrorMessage}</div>
        )}
      </div>
      <UpsertCalendarModal
        isUpdating={isUpdating}
        calendarMessageFunc={memoizedSetMessage}
        allDoctors={allDoctorUsers}
      />
    </div>
  );
};

export default UpcomingSection;
