'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { publicRuntimeConfig } from '../../../next.config';

export default function LoginModule() {
  const { NEXT_PUBLIC_API_BASE_URL } = publicRuntimeConfig;
  const gradientTextStyle = {
    background: 'linear-gradient(264.68deg, #117180 5.64%, #35A576 93.48%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };

  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', result.access_token);
        result.is_super_admin
          ? router.push('/practices')
          : router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full flex flex-col justify-center items-center shadow-lg rounded-2xl py-8">
        <div className="mt-5">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            LOGIN
          </h2>
        </div>
        <div className="mt-5">
          <h2 className="text-center text-3xl font-extrabold">
            <span
              className="text-transparent bg-gradient-to-br from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={gradientTextStyle}
            >
              AZENTIA
            </span>
          </h2>
        </div>
        <div className="mt-16">
          <form className="" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-px">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      autoComplete="email"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder=""
                      value={email}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder=""
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between">
                <div className="flex-none">
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center item-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-br from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Login
                  </button>
                </div>
                <div className="flex-none ">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot Password
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
