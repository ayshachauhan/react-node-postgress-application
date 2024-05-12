'use client';
import { ICalendar } from '@packages/entities/index.browser';
import { useAppSelector } from '@root/store';
import React from 'react';

export type CalendarData = {
  maxSlots: number;
  bookedSlots: number;
};

const SurgeryPercentage: React.FC = () => {
  const { calendars, surgeryConfigurations } = useAppSelector((state) => ({
    calendars: Object.values(state.calendars.entities),
    surgeryConfigurations: Object.values(state.surgeryConfigurations.entities),
  }));

  function calculateSurgeryPercentageForRange(
    rangeInMonths: number | 'all',
  ): { name: string; id: string; percentage: number }[] {
    const today = new Date();
    const surgeryPercentage: {
      name: string;
      id: string;
      percentage: number;
    }[] = [];

    surgeryConfigurations.forEach((config) => {
      const selectedSurgeryId = config.id;
      let matchingDates: CalendarData[] = [];

      if (rangeInMonths === 'all') {
        matchingDates = calendars
          .filter(
            (data: ICalendar) =>
              data.surgeryConfiguration.id === selectedSurgeryId,
          )
          .map((data: ICalendar) => ({
            maxSlots: data.maxSlots,
            bookedSlots: data.bookedSlots,
          }));
      } else {
        const endDate = new Date(
          today.getFullYear(),
          today.getMonth() + rangeInMonths,
          today.getDate(),
        );
        matchingDates = calendars
          .filter((data: ICalendar) => {
            const calendarDate = new Date(data.date);
            return (
              data.surgeryConfiguration.id === selectedSurgeryId &&
              calendarDate >= today &&
              calendarDate <= endDate
            );
          })
          .map((data: ICalendar) => ({
            maxSlots: data.maxSlots,
            bookedSlots: data.bookedSlots,
          }));
      }

      const totalMaxSlots = matchingDates.reduce(
        (acc, cur) => acc + cur.maxSlots,
        0,
      );
      const totalBookedSlots = matchingDates.reduce(
        (acc, cur) => acc + cur.bookedSlots,
        0,
      );
      const percentage =
        totalMaxSlots !== 0 ? (totalBookedSlots / totalMaxSlots) * 100 : 0;

      surgeryPercentage.push({
        name: config.name,
        id: selectedSurgeryId,
        percentage: percentage,
      });
    });

    return surgeryPercentage;
  }

  const surgeryPercentageData = surgeryConfigurations.map((config) => ({
    name: config.name,
    id: config.id,
    percentages: [1, 2, 3, 6, 12, 'all'].map((range) => ({
      range: range,
      percentage:
        calculateSurgeryPercentageForRange(range).find(
          (surgery) => surgery.id === config.id,
        )?.percentage || 0,
    })),
  }));

  return (
    <div>
      <div className="text-lg font-normal">
        Surgery Percentage
        <hr className="h-px my-2.5 bg-gray-100 border-1 border-gray-100"></hr>
      </div>
      <div className="mt-2 text-xs overflow-x-auto">
        <div className="text-gray-50 w-full items-center rounded-lg">
          <div className="bg-gradient-to-br from-teal-600 to-green-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex">
            <div className="font-bold text-white p-4 w-20">Surgery</div>
            <div className="font-bold text-white p-4 w-10">1</div>
            <div className="font-bold text-white p-4 w-10">2</div>
            <div className="font-bold text-white p-4 w-10">3</div>
            <div className="font-bold text-white p-4 w-10">6</div>
            <div className="font-bold text-white p-4 w-10">12</div>
            <div className="font-bold text-white p-4 w-10">All</div>
          </div>
          {surgeryPercentageData.map((surgery, index) => (
            <React.Fragment key={surgery.id}>
              <div
                className={`flex ${
                  index !== surgeryPercentageData.length - 1
                    ? 'border-b border-gray-300'
                    : ''
                }`}
              >
                <div className="text-black pt-2 pb-2 px-4 w-20">
                  {surgery.name}
                </div>
                <div className="text-black pt-2 pb-2 px-4 w-10">
                  {surgery?.percentages[0].percentage.toFixed(0)}%
                </div>
                <div className="text-black pt-2 pb-2 px-4 w-10">
                  {surgery?.percentages[1].percentage.toFixed(0)}%
                </div>
                <div className="text-black pt-2 pb-2 px-4 w-10">
                  {surgery?.percentages[2].percentage.toFixed(0)}%
                </div>
                <div className="text-black pt-2 pb-2 px-4 w-10">
                  {surgery?.percentages[3].percentage.toFixed(0)}%
                </div>
                <div className="text-black pt-2 pb-2 px-4 w-10">
                  {surgery?.percentages[4].percentage.toFixed(0)}%
                </div>
                <div className="text-black pt-2 pb-2 px-4 w-10">
                  {surgery?.percentages[5].percentage.toFixed(0)}%
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
