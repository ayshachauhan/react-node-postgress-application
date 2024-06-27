'use client';
import { ICalendar } from '@packages/entities/index.browser';
import { useAppSelector } from '@root/store';
import { getUserId } from '@root/utils';
import React from 'react';

export type CalendarData = {
  maxSlots: number;
  bookedSlots: number;
};

const SurgeryPercentage: React.FC = () => {
  const userId: string | null = getUserId();
  const { calendars, surgeryConfigurations } = useAppSelector((state) => ({
    calendars: Object.values(state.calendars.entities).filter(
      (calendar) => calendar.user.id === userId,
    ),
    surgeryConfigurations: Object.values(state.surgeryConfigurations.entities),
  }));

  const maxCellStyle = (cellValue: string) => {
    const numericValue =
      typeof cellValue === 'string'
        ? parseInt(cellValue.replace('%', ''), 10)
        : cellValue;
    const isRed = numericValue < 50;
    const isYellow = numericValue >= 50 && numericValue < 80;
    const isGreen = numericValue >= 80;
    if (isRed) {
      return { color: 'rgba(239, 68, 68, 1)' };
    } else if (isYellow) {
      return { color: 'rgba(234, 179, 8, 1)' };
    } else if (isGreen) {
      return { color: 'rgb(53, 165, 118)' };
    } else {
      return {};
    }
  };

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
  const ranges: (number | 'all')[] = [1, 2, 3, 6, 12, 'all'];

  const surgeryPercentageData = surgeryConfigurations.map((config) => ({
    name: config.name,
    id: config.id,
    percentages: ranges.map((range) => ({
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
        <table className="w-full">
          <thead className="">
            <th className="">Surgery</th>
            <th className="text-center">1</th>
            <th className="text-center">2</th>
            <th className="text-center">3</th>
            <th className="text-center">6</th>
            <th className="text-center">12</th>
            <th className="text-center">All</th>
          </thead>
          <tbody>
            {surgeryPercentageData.map((surgery, index) => (
              <React.Fragment key={surgery.id}>
                <tr
                  className={`${
                    index !== surgeryPercentageData.length - 1
                      ? 'border-b border-gray-300'
                      : ''
                  }`}
                >
                  <td className="">{surgery.name}</td>
                  {surgery?.percentages.map((percentageObj, index) => (
                    <td
                      key={index}
                      className="text-center"
                      style={maxCellStyle(percentageObj.percentage.toFixed(0))}
                    >
                      {percentageObj.percentage.toFixed(0)}%
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurgeryPercentage;
