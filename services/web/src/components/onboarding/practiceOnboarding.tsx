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
} from '@root/store/reducers/users';
import { setLoginCookie } from '@root/store/requests/login';
import { ChangePasswordInterface } from '@root/store/requests/users';
import { AzentiaLogo } from '@utils/constants';
import {
  checkPasswordStrength,
  encryptPassword,
  getPracticeId,
  validatePassword,
} from '@utils/index';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RequiredIndicator from '../RequiredIndicator';
import { AlreadyOnboarded } from './completedOnboarding';

export default function PracticeOnboardPage() {
  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.users.successMessage,
    errorMessage: state.users.errorMessage,
  }));
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const practiceId = getPracticeId();
  const practiceInfo = useAppSelector((state) => state.practices.practiceInfo);
  const userInfo = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token: string | null = searchParams.get('token');
  const [passwordStrength, setPasswordStrength] = useState('');

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  useEffect(() => {
    if (token) {
      setLoginCookie(token);

      if (!userInfo) {
        dispatch(fetchLoggedInUser());
      }

      if (
        practiceId &&
        (!practiceInfo || Object.keys(practiceInfo).length === 0)
      ) {
        dispatch(getPracticeInfo({ id: practiceId }));
      }
    }
  }, [practiceId, token]);

  const isLoading =
    !userInfo ||
    !userInfo.practices ||
    !practiceInfo ||
    Object.keys(practiceInfo).length === 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordErrorMessage = validatePassword(newPassword);
    if (passwordErrorMessage) {
      setPasswordErrorMessage(passwordErrorMessage);
      return;
    } else {
      setPasswordErrorMessage('');
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMessage(
        'New password and confirm password do not match.',
      );
      return;
    }

    const encryptedNewPassword = encryptPassword(newPassword);
    const encryptedConfirmPassword = encryptPassword(confirmPassword);
    const encryptedOldPassword = encryptPassword(oldPassword);

    if (userInfo && userInfo.practices) {
      const payload: ChangePasswordInterface = {
        practiceId: userInfo.practices[0].id,
        email: userInfo?.email,
        confirmPassword: encryptedConfirmPassword,
        oldPassword: encryptedOldPassword,
        newPassword: encryptedNewPassword,
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
            dangerouslySetInnerHTML={{ __html: AzentiaLogo }}
          />
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : practiceInfo.status === 'active' ? (
          <AlreadyOnboarded type="Practice" />
        ) : (
          <>
            <div className="mt-11 mx-11">
              <form className="w-full" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                {passwordErrorMessage && (
                  <div className="flex justify-center text-red-500 mt-2 mb-2">
                    {passwordErrorMessage}
                  </div>
                )}
                <div className="mb-4">
                  <div className="mb-1">
                    {' '}
                    <label htmlFor="oldPassword" className="text-black text-sm">
                      <RequiredIndicator />
                      &nbsp;Old Password
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
                      <RequiredIndicator />
                      &nbsp;New Password
                    </label>
                  </div>

                  <TextInput
                    name="newPassword"
                    value={newPassword}
                    onChange={(value) => handlePasswordChange(value)}
                    required
                    type="password"
                  />
                  {newPassword && (
                    <p
                      className={`text-sm ${
                        passwordStrength === 'Strong'
                          ? 'text-green-600'
                          : passwordStrength === 'Medium'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}
                    >
                      Strength: {passwordStrength}
                    </p>
                  )}
                  <div className="space-y-4"></div>
                </div>
                <div className="">
                  <div className="mb-1">
                    {' '}
                    <label
                      htmlFor="confirmPassword"
                      className="text-black text-sm"
                    >
                      <RequiredIndicator />
                      &nbsp;Confirm Password
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
              {errorMessage && (
                <div className="text-red-700">{errorMessage}</div>
              )}{' '}
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
