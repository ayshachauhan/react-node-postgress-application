'use client';
import Button from '@root/components/Button';
import { LogoWrapper } from '@root/components/LogoWrapper/logoWrapper';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import {
  clearErrorMessage,
  clearSuccessMessage,
  forgotPassword,
} from '@root/store/reducers/auth';
import { useEffect, useState } from 'react';

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const { successMessage, errorMessage } = useAppSelector((state) => ({
    successMessage: state.auth.successMessage,
    errorMessage: state.auth.errorMessage,
  }));
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await dispatch(forgotPassword({ email }));

      if (response?.type == 'users/forgotPassword/fulfilled') {
        setIsEmailSent(true);
      }
    } catch (error) {
      console.log(error);
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
    <LogoWrapper>
      <>
        <div className="mt-11 mx-11">
          {isEmailSent ? (
            <div>
              <div className="mb-1">
                {' '}
                <h1 className="text-black text-xl">Email Sent!</h1>
                <p
                  className="mt-3"
                  style={{ width: '328px', color: '#71717A' }}
                >
                  Check your {email} inbox for instructions on how to reset your
                  password.
                </p>
              </div>
            </div>
          ) : (
            <form className="w-full" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="mb-4">
                <div className="mb-1">
                  {' '}
                  <label htmlFor="oldPassword" className="text-black text-sm">
                    Enter your Email
                  </label>
                </div>

                <TextInput
                  name="email"
                  value={email}
                  onChange={(value) => setEmail(value)}
                  required
                  type="email"
                />
                <div className="space-y-4"></div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <Button kind="primary" title="Send" type="submit" width={359} />
                <p
                  className="mt-3"
                  style={{ width: '328px', color: '#71717A' }}
                >
                  We will send a verification mail on your mail id.
                </p>
              </div>
            </form>
          )}
          {showErrorMessage && (
            <div className="text-red-700">{errorMessage}</div>
          )}
        </div>
      </>
    </LogoWrapper>
  );
};

export default ForgotPassword;
