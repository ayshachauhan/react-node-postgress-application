'use client';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { getPracticeInfo } from '@root/store/reducers/practices';

import { getPracticeId } from '@utils/index';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import ResetPassword from '../ResetPassword/resetPassword';
import { AlreadyOnboarded } from './completedOnboarding';

export default function PracticeOnboardPage() {
  const dispatch = useAppDispatch();

  const practiceId = getPracticeId();
  const practiceInfo = useAppSelector((state) => state.practices.practiceInfo);
  const userInfo = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const token: string | null = searchParams.get('token');

  useEffect(() => {
    if (token) {
      Cookies.set('access_token', token, {
        expires: 1,
      });

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

  return (
    <ResetPassword
      isOnboarding={true}
      isAlreadyOnboared={Boolean(
        practiceInfo && practiceInfo.status == 'active',
      )}
    >
      <AlreadyOnboarded type="User" />
    </ResetPassword>
  );
}
