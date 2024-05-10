'use client';
import { useAppSelector } from '@root/store';
import { getPracticeId, getUserId } from '@root/utils';
import React from 'react';
// import {
//   ICalendar
// } from '@packages/entities/index.browser';

export type CalendarData = {
  id: string;
  date: Date;
  maxSlots: number;
  bookedSlots: number;
  surgeryName: string;
  surgeryNameColor: string;
};

const SurgeryPercentage: React.FC = () => {
  console.log(getUserId(), 'getuser');
  const selectedDoctorId = getUserId();
  console.log(selectedDoctorId, 'doctor');
  const practiceId = getPracticeId();
  console.log(practiceId);
  const { surgeryConfigurations } = useAppSelector((state) => ({
    calendars: Object.values(state.calendars.entities),
    surgeryConfigurations: Object.values(state.surgeryConfigurations.entities),
  }));
  // const upcomingDates: CalendarData[] = calendars
  //   .filter(
  //     (data: ICalendar) => data.surgeryConfiguration.id === selectedSurgery?.id,
  //   )
  //   .map((data: ICalendar) => ({
  //     maxSlots: data.maxSlots,
  //     bookedSlots: data.bookedSlots,
  //   }));
  //   console.log(upcomingDates)

  const surgeryPercentage = surgeryConfigurations.map((config, index) => ({
    name: config.name,
    percentage: `${index + 10}`, // Example percentage based on index
    id: config.id,
  }));

  const appendPercentageSign = (cellValue: string) => {
    return cellValue + '%';
  };

  return (
    <div>
      <div className="text-lg font-normal">
        Surgery Percentage
        <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      </div>
      <div className="mt-2 text-xs overflow-x-auto">
        <div className="text-gray-50 w-full items-center bg-gray-50 rounded-lg">
          <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
            <div className="font-bold text-white p-4 w-20">Surgery</div>
            <div className="font-bold text-white p-4 w-10">1</div>
            <div className="font-bold text-white p-4 w-10">2</div>
            <div className="font-bold text-white p-4 w-10">3</div>
            <div className="font-bold text-white p-4 w-10">6</div>
            <div className="font-bold text-white p-4 w-10">12</div>
            <div className="font-bold text-white p-4 w-10">All</div>
          </div>
          {surgeryPercentage.map((surgery, index) => (
            <React.Fragment key={surgery.id}>
              <div
                className={`flex ${
                  index !== surgeryPercentage.length - 1
                    ? 'border-b border-gray-300'
                    : ''
                }`}
              >
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-20">
                  {surgery.name}
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                  {appendPercentageSign(surgery.percentage)}
                </div>
                <div className="text-black bg-gray-50 pt-2 pb-2 px-4 w-10">
                  {appendPercentageSign(surgery.percentage)}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurgeryPercentage;
