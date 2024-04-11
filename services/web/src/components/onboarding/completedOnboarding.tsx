'use client';
import React from 'react';

interface ChildProps {
  type: string;
}

export const AlreadyOnboarded: React.FC<ChildProps> = ({ type }) => {
  return <div className="mt-11 mx-11">{type} Already Onboarded.</div>;
};
