'use client';
import Button from '@root/components/Button';
import { COOKIES, setCookie } from '@root/services/cookies';
import { useAppDispatch, useAppSelector } from '@root/store';
import { fetchLoggedInUser } from '@root/store/reducers/auth';
import { getPracticeInfo } from '@root/store/reducers/practices';
import {
  changePasswordAsync,
  clearErrorMessage,
  clearSuccessMessage,
} from '@root/store/reducers/users';
import { ChangePasswordInterface } from '@root/store/requests/users/types';
import { getPracticeId } from '@root/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogoWrapper } from '../LogoWrapper/logoWrapper';
import TextInput from '../TextInput/TextInput';

export type Props = {
  children?: React.ReactNode;
  isOnboarding?: boolean;
  isAlreadyOnboared?: boolean;
};

export const ResetPassword: React.FC<Props> = ({
  children,
  isOnboarding,
  isAlreadyOnboared,
}: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tokenExpired, setTokenExpired] = useState(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.users.successMessage,
    errorMessage: state.users.errorMessage,
  }));
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const practiceId = getPracticeId();
  const practiceInfo = useAppSelector((state) => state.practices.practiceInfo);
  const userInfo = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const token: string | null = searchParams.get('token');

  useEffect(() => {
    if (token) {
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 15 * 60 * 1000);
      setCookie(COOKIES.ACCESS_TOKEN, token, {
        expires: expirationDate,
      });
    }

    if (!userInfo) {
      (async () => {
        try {
          const userResponse = await dispatch(fetchLoggedInUser(true));
          if (fetchLoggedInUser.rejected.match(userResponse)) {
            if (userResponse.error.message === 'Token expired') {
              setTokenExpired(true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }

    const isPracticeInfoEmpty =
      practiceInfo && Object.getOwnPropertyNames(practiceInfo).length === 0;

    if (isPracticeInfoEmpty && practiceId) {
      dispatch(getPracticeInfo({ id: practiceId }));
    }
  }, [practiceId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInfo && userInfo.practices) {
      setTokenExpired(false);
      const payload: ChangePasswordInterface = {
        practiceId: userInfo.practices[0].id,
        email: userInfo?.email,
        confirmPassword,
        oldPassword,
        newPassword,
        token,
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

  const handleGoBack = () => {
    setTokenExpired(false);
    router.back();
  };

  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 5000);
    }
    if (errorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearErrorMessage());
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div>
      {!token ? (
        <div className="flex justify-between border-gray-400 items-center ml-2 mt-2">
          <Button
            kind="primary"
            title="Go Back"
            onClick={handleGoBack}
          ></Button>
        </div>
      ) : null}
      {tokenExpired ? (
        <div className="flex justify-between border-gray-400 items-center ml-2 mt-5 flex-col text-red-900">
          <p>Reset Password link has been expired</p>
        </div>
      ) : (
        <LogoWrapper>
          {isAlreadyOnboared && isOnboarding ? (
            children
          ) : (
            <>
              <div className="mt-11 mx-11">
                <form className="w-full" onSubmit={handleSubmit}>
                  <input type="hidden" name="remember" defaultValue="true" />
                  {!isAlreadyOnboared && isOnboarding ? (
                    <div className="mb-4">
                      <div className="mb-1">
                        {' '}
                        <label
                          htmlFor="oldPassword"
                          className="text-black text-sm"
                        >
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
                  ) : null}
                  <div className="mb-4">
                    <div className="mb-1">
                      <label
                        htmlFor="newPassword"
                        className="text-black text-sm"
                      >
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
                {showErrorMessage && (
                  <div className="text-red-700">{errorMessage}</div>
                )}
              </div>
            </>
          )}
        </LogoWrapper>
      )}
    </div>
  );
};

export default ResetPassword;
