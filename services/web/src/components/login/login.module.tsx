'use client';
import Button from '@root/components/Button';
import TextInput from '@root/components/TextInput';
import { useAppDispatch, useAppSelector } from '@root/store';
import { loginUser, selectError } from '@root/store/reducers/auth';
import { AzentiaLogo } from '@utils/constants';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const error = useAppSelector(selectError); // Select success message from Redux store
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await dispatch(loginUser({ email, password }));
      if (user.payload?.access_token) {
        if (user.payload?.is_super_admin) {
          router.push('/practices');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full items-center shadow-xl rounded-2xl justify-center py-8">
        <div className=" flex flex-col justify-center items-center">
          <div className="text-3xl mt-10">Login</div>
          <div
            className="mt3"
            dangerouslySetInnerHTML={{ __html: AzentiaLogo }}
          />
        </div>
        <div className="mt-11 mx-11">
          <form className="w-full" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="space-y-4">
              <label htmlFor="email" className="text-black text-sm">
                User Name
              </label>
              <TextInput
                name="email"
                value={email}
                onChange={(value) => setUsername(value)}
                required
              />
              <div className="space-y-4"></div>
            </div>
            <div className="space-y-4">
              <label htmlFor="password" className="text-black text-sm">
                Password
              </label>

              <TextInput
                name="password"
                value={password}
                onChange={(value) => setPassword(value)}
                required
                type="password"
              />
              <div className="space-y-4"></div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center">
              <Button kind="primary" title="Login" type="submit" width={164} />
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-400 hover:text-blue-500 sm:pt-3"
                >
                  Forgot Password
                </a>
              </div>
            </div>
          </form>
          {error && <div className="text-red-700">{error}</div>}{' '}
          {/* Display error message if present */}
        </div>
      </div>
    </div>
  );
}
