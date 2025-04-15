'use client';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { getPracticeInfo } from '@root/store/reducers/practices';

import { setLoginCookie } from '@root/store/requests/login';
import { getPracticeId } from '@utils/index';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import ResetPassword from '../ResetPassword/resetPassword';
import { AlreadyOnboarded } from './completedOnboarding';

export default function PracticeOnboardPage() {
  const dispatch = useAppDispatch();

  const practiceId = getPracticeId();
  const practiceInfo = useAppSelector((state) => state.practices.practiceInfo);
  const userInfo = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const token: string | null = searchParams.get('token');
  const isUserLoading = userInfo === undefined;

  useEffect(() => {
    if (token) {
      setLoginCookie(token);

      if (!userInfo) {
        dispatch(fetchLoggedInUser());
      }

      const isPracticeInfoEmpty =
        practiceInfo && Object.getOwnPropertyNames(practiceInfo).length === 0;

      if (isPracticeInfoEmpty && practiceId) {
        dispatch(getPracticeInfo({ id: practiceId }));
      }
    }
  }, []);

  const isUserAlreadyOnboarded: boolean = useMemo(() => {
    return !!(userInfo && userInfo.status === 'active');
  }, [userInfo]);

  if (isUserLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <ResetPassword
      isOnboarding={true}
      isAlreadyOnboared={isUserAlreadyOnboarded}
    >
      <AlreadyOnboarded type="User" />
    </ResetPassword>
  );
}
