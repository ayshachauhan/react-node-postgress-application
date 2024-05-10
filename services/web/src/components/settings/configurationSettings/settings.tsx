'use client';
import React from 'react';
import PracticeHomesPage from './PracticeHomes/practiceHome';
import InsuranceTypePage from './insuranceTypes/insuranceType';
import SurgeryTypePage from './surgeryTypes/surgeryType';

export default function SettingsPage() {
  return (
    <div>
      <div className="flex flex-row pt-4 justify-stretch  align-middle pb-10">
        <div className="flex-1">
          <SurgeryTypePage />
        </div>
        <div className="px-4 flex-1">
          <PracticeHomesPage />
        </div>
      </div>
      <hr className="h-px my-2.5 bg-gray-100 border-1 dark:bg-gray-800"></hr>
      <div className="flex  flex-row justify-stretch pt-4">
        <div className="w-1/2">
          <InsuranceTypePage />
        </div>
      </div>
    </div>
  );
}
