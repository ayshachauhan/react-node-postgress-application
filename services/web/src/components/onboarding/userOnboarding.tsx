'use client';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { getPracticeInfo } from '@root/store/reducers/practices';
import {
  changePasswordAsync,
  clearErrorMessage,
  clearSuccessMessage,
  selectError,
  selectSuccessMessage,
} from '@root/store/reducers/users';
import { ChangePasswordInterface } from '@root/store/requests/users';
import { AzentiaLogo } from '@utils/constants';
import { getPracticeId } from '@utils/methods';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AlreadyOnboarded } from './completedOnboarding';

export default function PracticeOnboardPage() {
  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const successMessage = useAppSelector(selectSuccessMessage);
  const errorMessage = useAppSelector(selectError);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const practiceId = getPracticeId();
  const practiceInfo = useAppSelector((state) => state.practices.practiceInfo);
  const userInfo = useAppSelector((state) => state.auth.user);
  const router = useRouter();
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
        Object.getOwnPropertyNames(practiceInfo).length === 0;

      if (isPracticeInfoEmpty && practiceId) {
        dispatch(getPracticeInfo({ id: practiceId }));
      }
    }
  }, []);

  const error = useAppSelector(selectError);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (practiceId && userInfo) {
      const payload: ChangePasswordInterface = {
        practiceId,
        email: userInfo?.email,
        confirmPassword,
        oldPassword,
        newPassword,
      };
      try {
        const response = await dispatch(changePasswordAsync(payload));
        if (response?.type == 'users/changePasswordAsync/fulfilled') {
          router.push('/login');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 2000);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col max-w-md w-full items-center shadow-xl rounded-2xl justify-center py-8">
        <div className=" flex flex-col justify-center items-center">
          <div
            className="mt3"
            dangerouslySetInnerHTML={{
              __html: AzentiaLogo,
            }}
          />
        </div>

        {practiceInfo && practiceInfo.status == 'active' ? (
          <div>
            <AlreadyOnboarded type="User" />
          </div>
        ) : (
          <>
            <div className="mt-11 mx-11">
              <form className="w-full" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="mb-4">
                  <div className="mb-1">
                    {' '}
                    <label htmlFor="oldPassword" className="text-black text-sm">
                      Old Password
                    </label>
                  </div>

                  <TextInput
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(value) => setOldPassword(value)}
                    required
                    type="password"
                  />
                  <div className="space-y-4"></div>
                </div>
                <div className="mb-4">
                  <div className="mb-1">
                    <label htmlFor="newPassword" className="text-black text-sm">
                      New Password
                    </label>
                  </div>

                  <TextInput
                    name="newPassword"
                    value={newPassword}
                    onChange={(value) => setNewPassword(value)}
                    required
                    type="password"
                  />
                  <div className="space-y-4"></div>
                </div>
                <div className="">
                  <div className="mb-1">
                    {' '}
                    <label
                      htmlFor="confirmPassword"
                      className="text-black text-sm"
                    >
                      Confirm Password
                    </label>
                  </div>

                  <TextInput
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(value) => setConfirmPassword(value)}
                    required
                    type="password"
                  />
                  <div className="space-y-4"></div>
                </div>
                <div className="mt-6 flex flex-col items-center">
                  <Button
                    kind="primary"
                    title="Reset"
                    type="submit"
                    width={164}
                  />
                </div>
              </form>
              {error && <div className="text-red-700">{error}</div>}{' '}
              {showErrorMessage && (
                <div className="text-red-700">{errorMessage}</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
