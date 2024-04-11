'use client';
import React from 'react';
import PracticeHomesPage from './PracticeHomes/practiceHome';
import SurgeryTypePage from './surgeryTypes/surgeryType';

export default function SettingsPage() {
  return (
    <div>
      <div className="flex flex-row pt-4 justify-around align-middle">
        <div>
          <SurgeryTypePage />
        </div>
        <div className="px-4">
          <PracticeHomesPage />
        </div>
      </div>
    </div>
  );
}
